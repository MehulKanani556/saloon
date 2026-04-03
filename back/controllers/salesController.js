const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const mongoose = require('mongoose');

// @desc Get Financial Matrix (Revenue Stats, Growth, Categories)
const getFinancialMatrix = async (req, res) => {
    try {
        const appointments = await Appointment.find({ status: 'Completed', paymentStatus: 'Paid' })
            .populate({
                path: 'assignments.service',
                populate: { path: 'category', select: 'name' }
            });

        // Net Revenue
        const totalRevenue = appointments.reduce((sum, app) => sum + (app.totalPrice || 0), 0);

        const categoryDataRaw = {};
        appointments.forEach(app => {
            if (app.assignments && Array.isArray(app.assignments)) {
                app.assignments.forEach(assignment => {
                    const service = assignment.service;
                    if (service && service.category) {
                        const catName = service.category.name || 'Unknown Protocol';
                        if (!categoryDataRaw[catName]) {
                            categoryDataRaw[catName] = { value: 0, count: 0 };
                        }
                        categoryDataRaw[catName].value += (service.price || 0);
                        categoryDataRaw[catName].count += 1;
                    }
                });
            }
        });

        const palette = [
            '#ff3d9f', // Rosegold
            '#6366f1', // Indigo
            '#10b981', // Emerald
            '#f59e0b', // Amber
            '#0ea5e9', // Sky
            '#8b5cf6', // Violet
            '#ec4899', // Pink
            '#f97316', // Orange
            '#14b8a6', // Teal
            '#4f46e5', // Royal
        ];

        const categoryData = Object.keys(categoryDataRaw).map((name, index) => ({
            name: name,
            value: categoryDataRaw[name].value,
            count: categoryDataRaw[name].count,
            color: palette[index % palette.length]
        }));

        // Chart Data (Daily for last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const chartDataRaw = await Appointment.aggregate([
            {
                $match: {
                    status: 'Completed',
                    paymentStatus: 'Paid',
                    appointmentDate: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            totalRevenue,
            dailyAvg: totalRevenue / 30,
            growth: (() => {
                // Compare this month vs last month
                const now = new Date();
                const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

                const thisMonthRev = appointments
                    .filter(a => new Date(a.createdAt) >= thisMonthStart)
                    .reduce((sum, a) => sum + (a.totalPrice || 0), 0);
                const lastMonthRev = appointments
                    .filter(a => new Date(a.createdAt) >= lastMonthStart && new Date(a.createdAt) <= lastMonthEnd)
                    .reduce((sum, a) => sum + (a.totalPrice || 0), 0);

                if (!lastMonthRev) return 0;
                return parseFloat(((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1));
            })(),
            categoryData,
            chartData: chartDataRaw.map(d => {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayName = days[new Date(d._id).getDay()];
                return { name: dayName, revenue: d.revenue };
            })
        });
    } catch (err) {
        res.status(500).json({ message: 'Financial intelligence retrieval failed', error: err.message });
    }
};

// @desc Process Withdrawal Request
// @route POST /sales/withdraw
// @access Private/Admin
const processWithdrawal = async (req, res) => {
    try {
        const { amount, bankAccount, notes } = req.body;
        if (!amount || !bankAccount) {
            return res.status(400).json({ message: 'Amount and bank account are required' });
        }
        // In a real system this would integrate with a payment gateway
        // For now we log and confirm the request
        res.json({
            success: true,
            message: 'Withdrawal request received',
            reference: `WD-${Date.now().toString(36).toUpperCase()}`,
            amount,
            bankAccount: `****${bankAccount.slice(-4)}`,
            notes: notes || ''
        });
    } catch (err) {
        res.status(500).json({ message: 'Withdrawal protocol failed', error: err.message });
    }
};

module.exports = { getFinancialMatrix, processWithdrawal };
