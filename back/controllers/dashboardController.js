const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');
const Leave = require('../models/Leave');
const moment = require('moment');

const pctChange = (current, previous) => {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
};

// @desc Get Dashboard Collective Intelligence
const getDashboardInsights = async (req, res) => {
    try {
        const isStaff = req.user.role === 'Staff';
        const staffId = req.user._id;

        const [appointments, clients, services, staff, pendingLeaves] = await Promise.all([
            Appointment.find(isStaff ? { 'assignments.staff': staffId } : {})
                .populate(['client', 'assignments.staff', { path: 'assignments.service', populate: { path: 'category' } }]),
            User.countDocuments({ role: 'User' }),
            Service.find().populate('category'),
            User.find({ role: 'Staff' }).limit(2),
            Leave.countDocuments(isStaff ? { staff: staffId, status: 'Pending' } : { status: 'Pending' })
        ]);

        // 1. Core Matrix Stats
        const totalRevenue = appointments
            .filter(app => (app.paymentStatus === 'Paid' || app.paymentStatus === 'UPI') && app.status !== 'Cancelled')
            .reduce((sum, app) => sum + (app.totalPrice || 0), 0);
        const todayRevenue = appointments
            .filter(app => moment(app.appointmentDate).isSame(moment(), 'day') && (app.paymentStatus === 'Paid' || app.paymentStatus === 'UPI') && app.status !== 'Cancelled')
            .reduce((sum, app) => sum + (app.totalPrice || 0), 0);
        const activeServices = services.filter(s => s.isActive).length;

        // 2. Financial Velocity (Last 7 Days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = moment().subtract(i, 'days');
            const dayRevenue = appointments
                .filter(app => moment(app.appointmentDate).isSame(date, 'day') && (app.paymentStatus === 'Paid' || app.paymentStatus === 'UPI') && app.status !== 'Cancelled')
                .reduce((sum, app) => sum + (app.totalPrice || 0), 0);

            last7Days.push({
                name: date.format('ddd'),
                revenue: dayRevenue
            });
        }

        // 3. Service Hierarchy (Niche Distribution)
        const categories = {};
        if (isStaff) {
            // For staff, show distribution of services THEY have performed
            appointments.forEach(app => {
                app.assignments.forEach(as => {
                    if (as.staff._id.toString() === staffId.toString()) {
                        const catName = as.service?.category?.name || 'Uncategorized';
                        categories[catName] = (categories[catName] || 0) + 1;
                    }
                });
            });
        } else {
            services.forEach(s => {
                const catName = s.category?.name || 'Uncategorized';
                categories[catName] = (categories[catName] || 0) + 1;
            });
        }

        const totalCategoriesCount = isStaff
            ? appointments.reduce((acc, app) => acc + app.assignments.filter(as => as.staff._id.toString() === staffId.toString()).length, 0)
            : services.length;

        const serviceData = Object.keys(categories).map((cat, i) => ({
            name: cat,
            value: totalCategoriesCount > 0 ? Math.round((categories[cat] / totalCategoriesCount) * 100) : 0,
            color: ['#ff3d9f', '#b57e65', '#6366f1', '#10b981', '#f59e0b'][i % 5]
        }));

        const totalValidAppointments = appointments.filter(app => ['Pending', 'Confirmed', 'Completed'].includes(app.status)).length;

        // 4. Temporal Occupancy (Peak Hours)
        const hourCounts = new Array(24).fill(0);
        appointments.forEach(app => {
            const hour = moment(app.appointmentDate).hour();
            hourCounts[hour]++;
        });

        const occupancyTrends = hourCounts.map((count, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            intensity: count
        })).filter(h => h.intensity > 0 || (parseInt(h.hour) >= 9 && parseInt(h.hour) <= 21));

        // 5. Immediate Rituals (Upcoming Today)
        const today = moment().startOf('day');
        const upcomingRituals = appointments
            .filter(app =>
                moment(app.appointmentDate).isSame(today, 'day') &&
                ['Pending', 'Confirmed'].includes(app.status)
            )
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
            .slice(0, 5);

        const now = moment();
        const thisPeriodStart = now.clone().subtract(7, 'days').startOf('day');
        const prevPeriodStart = now.clone().subtract(14, 'days').startOf('day');
        const prevPeriodEnd = now.clone().subtract(7, 'days').endOf('day');

        const apptsThisPeriod = appointments.filter(a =>
            moment(a.createdAt).valueOf() >= thisPeriodStart.valueOf()
        ).length;
        const apptsPrevPeriod = appointments.filter(a => {
            const t = moment(a.createdAt).valueOf();
            return t >= prevPeriodStart.valueOf() && t <= prevPeriodEnd.valueOf();
        }).length;

        let clientsThisPeriod = 0;
        let clientsPrevPeriod = 0;
        if (!isStaff) {
            [clientsThisPeriod, clientsPrevPeriod] = await Promise.all([
                User.countDocuments({ role: 'User', createdAt: { $gte: thisPeriodStart.toDate() } }),
                User.countDocuments({
                    role: 'User',
                    createdAt: { $gte: prevPeriodStart.toDate(), $lte: prevPeriodEnd.toDate() }
                })
            ]);
        } else {
            const uniqueClientsInRange = (startMs, endMs) => new Set(
                appointments
                    .filter(a => {
                        const t = moment(a.createdAt).valueOf();
                        return t >= startMs && t <= endMs;
                    })
                    .map(a => a.client?._id?.toString())
                    .filter(Boolean)
            ).size;
            clientsThisPeriod = uniqueClientsInRange(thisPeriodStart.valueOf(), now.valueOf());
            clientsPrevPeriod = uniqueClientsInRange(prevPeriodStart.valueOf(), prevPeriodEnd.valueOf());
        }

        const yesterdayRevenue = last7Days.length >= 2 ? last7Days[last7Days.length - 2].revenue : 0;

        const trends = {
            totalClients: pctChange(clientsThisPeriod, clientsPrevPeriod),
            appointments: pctChange(apptsThisPeriod, apptsPrevPeriod),
            revenueToday: pctChange(todayRevenue, yesterdayRevenue)
        };

        res.json({
            stats: {
                totalClients: isStaff ? [...new Set(appointments.map(a => a.client?._id.toString()))].length : clients,
                totalAppointments: totalValidAppointments,
                totalRevenue,
                todayRevenue,
                activeServices,
                pendingLeaves
            },
            trends,
            revenueTrend: last7Days,
            categoryDistribution: serviceData,
            recentAppointments: appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)).slice(0, 5),
            occupancyData: occupancyTrends,
            upcomingAppointments: upcomingRituals,
            topStaff: isStaff ? [] : staff,
        });
    } catch (err) {
        res.status(500).json({ message: 'Insight retrieval failed', error: err.message });
    }
};

module.exports = { getDashboardInsights };
