const Leave = require('../models/Leave');
const moment = require('moment');

// @desc Apply for Leave
// @route POST /api/leaves
// @access Private (Staff)
const applyLeave = async (req, res) => {
    const { startDate, endDate, reason, startTime, endTime, totalHours, type } = req.body;
    try {
        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'Dates and reason are required' });
        }

        const leave = new Leave({
            staff: req.user._id,
            startDate: moment(startDate).toDate(),
            endDate: moment(endDate).toDate(),
            startTime,
            endTime,
            totalHours,
            type,
            reason
        });

        const createdLeave = await leave.save();
        const populatedLeave = await Leave.findById(createdLeave._id).populate('staff', 'name profileImage');
        res.status(201).json(populatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Failed to apply for leave', error: error.message });
    }
};

// @desc Get My Leaves
// @route GET /api/leaves/my
// @access Private (Staff)
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ staff: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve leave history', error: error.message });
    }
};

// @desc Get All Leaves
// @route GET /api/leaves
// @access Private (Admin)
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('staff', 'name email profileImage phone').sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve all leaves', error: error.message });
    }
};

// @desc Update Leave Status
// @route PUT /api/leaves/:id
// @access Private (Admin)
const updateLeaveStatus = async (req, res) => {
    const { status, adminComment } = req.body;
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave record not found' });
        }

        const oldStatus = leave.status;
        leave.status = status || leave.status;
        leave.adminComment = adminComment || leave.adminComment;

        // Conflict check for appointments
        if (status === 'Approved' && oldStatus !== 'Approved') {
            const Appointment = require('../models/Appointment');
            const start = moment(leave.startDate).startOf('day');
            const end = moment(leave.endDate).endOf('day');

            const conflicts = await Appointment.find({
                'assignments.staff': leave.staff,
                status: 'Confirmed',
                appointmentDate: { $gte: start.toDate(), $lte: end.toDate() }
            });

            // Precise conflict analysis: Unified per-day window logic
            const actualConflicts = conflicts.filter(app => {
                const appTime = moment(app.appointmentDate);
                
                // Determine the precise leave boundary for this specific appointment date
                let windowStart, windowEnd;
                
                // Start Boundary: If this is the start day, use startTime (default to start of day)
                if (appTime.isSame(leave.startDate, 'day') && leave.startTime) {
                    const [h, m] = leave.startTime.split(':');
                    windowStart = moment(app.appointmentDate).set({ hour: parseInt(h), minute: parseInt(m), second: 0 });
                } else {
                    windowStart = moment(app.appointmentDate).startOf('day');
                }
                
                // End Boundary: If this is the end day, use endTime (default to end of day)
                if (appTime.isSame(leave.endDate, 'day') && leave.endTime) {
                    const [h, m] = leave.endTime.split(':');
                    windowEnd = moment(app.appointmentDate).set({ hour: parseInt(h), minute: parseInt(m), second: 0 });
                } else {
                    windowEnd = moment(app.appointmentDate).endOf('day');
                }
                
                // Conflict exists if the appointment falls within the calculated daily window
                return appTime.isBetween(windowStart, windowEnd, null, '[]');
            });

            if (actualConflicts.length > 0) {
                return res.status(400).json({ 
                    message: `Conflict detected: There are ${actualConflicts.length} appointments scheduled during this time. Please reschedule them before approving the leave.` 
                });
            }

            const User = require('../models/User');
            await User.findByIdAndUpdate(leave.staff, {
                $inc: { leaveBalance: -(leave.totalHours || 0) }
            });
        }

        await leave.save();
        const populatedLeave = await Leave.findById(leave._id).populate('staff', 'name email profileImage phone');
        res.json(populatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update leave status', error: error.message });
    }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
