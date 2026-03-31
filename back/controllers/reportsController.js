const Appointment = require('../models/Appointment');
const User = require('../models/User');
const moment = require('moment');

// @desc Get Business Intelligence / Reports Data
// @route GET /reports/intel
// @access Private/Admin
const getReportIntel = async (req, res) => {
    try {
        const [appointments, clients, services, staff] = await Promise.all([
            Appointment.find().populate('client services'),
            User.countDocuments({ role: 'User' }),
            Service.countDocuments({ isActive: true }),
            User.countDocuments({ role: 'Staff' })
        ]);

        const completedPaid = appointments.filter(a => a.status === 'Completed' && a.paymentStatus === 'Paid');
        const totalRevenue = completedPaid.reduce((sum, a) => sum + (a.totalPrice || 0), 0);

        // Recent activity logs
        const recentLogs = appointments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)
            .map(app => ({
                id: app._id,
                type: app.status === 'Completed' ? 'completed' : app.status === 'Cancelled' ? 'cancelled' : 'scheduled',
                title: `Appointment — ${app.client?.name || 'Unknown Client'}`,
                description: app.services?.map(s => s.name).join(', ') || 'No services',
                amount: app.totalPrice || 0,
                status: app.status,
                paymentStatus: app.paymentStatus,
                date: app.appointmentDate || app.createdAt,
                createdAt: app.createdAt
            }));

        // Monthly breakdown (last 6 months)
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const month = moment().subtract(i, 'months');
            const monthStart = month.startOf('month').toDate();
            const monthEnd = month.endOf('month').toDate();

            const monthApps = completedPaid.filter(a => {
                const d = new Date(a.appointmentDate || a.createdAt);
                return d >= monthStart && d <= monthEnd;
            });

            monthlyData.push({
                name: month.format('MMM'),
                revenue: monthApps.reduce((sum, a) => sum + (a.totalPrice || 0), 0),
                appointments: monthApps.length
            });
        }

        res.json({
            stats: {
                active: appointments.filter(a => ['Pending', 'Confirmed'].includes(a.status)).length,
                downloads: completedPaid.length,
                shared: clients,
                archiveSize: `${(totalRevenue / 1000).toFixed(1)} K`
            },
            summary: {
                totalRevenue,
                totalAppointments: appointments.length,
                totalClients: clients,
                activeServices: services,
                totalStaff: staff
            },
            monthlyData,
            recentLogs
        });
    } catch (err) {
        res.status(500).json({ message: 'Report intelligence retrieval failed', error: err.message });
    }
};

module.exports = { getReportIntel };
