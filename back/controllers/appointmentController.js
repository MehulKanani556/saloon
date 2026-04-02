const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const moment = require('moment');

const createAppointment = async (req, res) => {
    try {
        const { clientEmail, clientName, clientPhone, services, assignments, date, status, paymentStatus, paymentIntentId } = req.body;

        // 1. Service Analysis & Temporal Alignment
        let finalAssignments = assignments || [];
        let serviceIds = services || finalAssignments.map(a => a.service);

        // Robust parsing for serviceIds from various formats
        if (serviceIds && typeof serviceIds === 'string') {
            serviceIds = serviceIds.split(',').map(s => s.replace(/[\[\]'"]/g, '').trim());
        }
        serviceIds = Array.isArray(serviceIds) ? serviceIds.filter(s => s && s.length === 24) : [];

        const normalizedDate = moment(date, ["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY", moment.ISO_8601], true);
        if (!date || !normalizedDate.isValid()) {
            return res.status(400).json({ message: 'Invalid appointment window. Please select a valid date and time.' });
        }

        if (serviceIds.length === 0) {
            return res.status(400).json({ message: 'Select at least one service to proceed.' });
        }

        const servicesFound = await Service.find({ _id: { $in: serviceIds } });
        if (!servicesFound.length) {
            return res.status(404).json({ message: 'One or more selected services are no longer available.' });
        }

        const totalDuration = servicesFound.reduce((acc, curr) => acc + (curr.duration || 30), 0);
        const totalPrice = servicesFound.reduce((acc, curr) => acc + curr.price, 0);
        const requestedStart = normalizedDate.toDate().getTime();
        const requestedEnd = requestedStart + (totalDuration * 60 * 1000);

        // 2. Master (Staff) Availability Protocol
        const Leave = require('../models/Leave');
        
        const checkMasterAvailability = async (staffId) => {
            // Check for Leave Conflicts (including partial days)
            const leaves = await Leave.find({
                staff: staffId,
                status: 'Approved',
                startDate: { $lte: new Date(requestedEnd) },
                endDate: { $gte: new Date(requestedStart) }
            });

            for (const lv of leaves) {
                let lvStart = lv.startDate.getTime();
                let lvEnd = lv.endDate.getTime();
                if (lv.startTime) {
                    const [h, m] = lv.startTime.split(':');
                    lvStart = Math.max(lvStart, normalizedDate.clone().set({ hour: parseInt(h), minute: parseInt(m) }).toDate().getTime());
                }
                if (lv.endTime) {
                    const [h, m] = lv.endTime.split(':');
                    lvEnd = Math.min(lvEnd, normalizedDate.clone().set({ hour: parseInt(h), minute: parseInt(m) }).toDate().getTime());
                }
                if (requestedStart < lvEnd && requestedEnd > lvStart) return false;
            }

            // Check for Appointment Overlaps
            const conflicts = await Appointment.find({
                'assignments.staff': staffId,
                appointmentDate: { 
                    $gte: normalizedDate.clone().startOf('day').toDate(), 
                    $lte: normalizedDate.clone().endOf('day').toDate() 
                },
                status: { $nin: ['Cancelled', 'No Show'] }
            }).populate('assignments.service');

            for (const conflict of conflicts) {
                const cStart = new Date(conflict.appointmentDate).getTime();
                const cDuration = conflict.assignments.reduce((acc, a) => acc + (a.service?.duration || 30), 0) * 60 * 1000;
                const cEnd = cStart + cDuration;
                if (requestedStart < cEnd && requestedEnd > cStart) return false;
            }

            return true;
        };

        if (finalAssignments.length === 0 || !finalAssignments[0].staff) {
            // Auto-Assignment Logic: Find first available master
            const eligibleStaff = await User.find({
                role: 'Staff',
                isActive: true,
                services: { $all: serviceIds }
            });

            let assignedStaffId = null;
            for (const stf of eligibleStaff) {
                if (await checkMasterAvailability(stf._id)) {
                    assignedStaffId = stf._id;
                    break;
                }
            }

            if (!assignedStaffId) {
                return res.status(400).json({ message: 'No specialists are available during this slot. Please try another time.' });
            }
            finalAssignments = serviceIds.map(sid => ({ service: sid, staff: assignedStaffId }));
        } else {
            // Verified User-Selected Staff
            for (const asm of finalAssignments) {
                if (!(await checkMasterAvailability(asm.staff))) {
                    return res.status(400).json({ message: 'The selected specialist is no longer available. Please refine your selection.' });
                }
            }
        }

        // 3. SECURE Client Profiling
        let client = await User.findOne({ 
            $or: [
                { phone: clientPhone },
                { email: clientEmail && clientEmail.trim() !== "" ? clientEmail : "no-email@aura.com" }
            ]
        });

        if (!client) {
            client = await User.create({ name: clientName, email: clientEmail, phone: clientPhone, role: 'User' });
        } else {
            if (clientPhone) client.phone = clientPhone;
            if (clientEmail && clientEmail.trim() !== "") client.email = clientEmail;
            if (clientName) client.name = clientName;
            await client.save();
        }

        const appointment = new Appointment({
            client: client._id,
            assignments: finalAssignments,
            appointmentDate: normalizedDate.toDate(),
            status: status || 'Pending',
            paymentStatus: paymentIntentId ? 'Paid' : (paymentStatus || 'Pending'),
            paymentIntentId,
            totalPrice
        });

        const createdAppointment = await (await appointment.save()).populate(['client', 'assignments.service', 'assignments.staff']);
        
        if (!client.bookingHistory) client.bookingHistory = [];
        client.bookingHistory.push(createdAppointment._id);
        await client.save();
        
        const { notifyAdmin } = require('../helpers/socketHelper');
        notifyAdmin('new_appointment', {
            id: createdAppointment._id,
            client: client.name,
            date: createdAppointment.appointmentDate
        });

        res.status(201).json(createdAppointment);
    } catch (error) {
        console.error('APPOINTMENT_CREATION_ERR:', error);
        res.status(500).json({ message: 'Internal engine error during booking: ' + error.message });
    }
};

const getAppointments = async (req, res) => {
    const isStaff = req.user.role === 'Staff';
    const filter = isStaff ? { 'assignments.staff': req.user._id } : {};
    
    const [appointments, leaves] = await Promise.all([
        Appointment.find(filter).populate('client assignments.service assignments.staff'),
        require('../models/Leave').find({ 
            status: 'Approved',
            ...(isStaff ? { staff: req.user._id } : {})
        }).populate('staff', 'name profileImage')
    ]);

    // Send both but format leaves to match calendar expectations if needed
    // For now, we'll send a structured response or just return both
    res.json({ appointments, leaves });
};

const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Logic specifically for Users
        if (req.user.role === 'User') {
            // Check Ownership
            if (appointment.client.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to dissolve this reservation' });
            }

            // Status Restriction: Only Pending appointments are dissolvable by Users
            if (appointment.status !== 'Pending') {
                return res.status(400).json({ message: 'Only Pending appointments can be cancelled by clients' });
            }

            // Instead of deleting from DB, mark as Cancelled (for history)
            appointment.status = 'Cancelled';
            await appointment.save();
            return res.json({ message: 'Appointment cancelled successfully', status: 'Cancelled' });
        }

        // Logic for Admin/Staff (Maintained existing physical delete for administrative cleanup)
        if (appointment.client) {
            await User.findByIdAndUpdate(appointment.client, {
                $pull: { bookingHistory: appointment._id }
            });
        }
        await appointment.deleteOne();
        res.json({ message: 'Appointment dissolved, client profile preserved.' });
    } catch (error) {
        console.error('Dissolution Error:', error);
        res.status(500).json({ message: 'System error during dissolution: ' + error.message });
    }
};

const updateAppointment = async (req, res) => {
    const { clientEmail, clientName, clientPhone, services, date, status, paymentStatus } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        let sInput = services;
        if (sInput) {
            if (typeof sInput === 'string') {
                if (sInput.includes(',')) {
                    sInput = sInput.split(',').map(s => s.replace(/[\[\]'"]/g, '').trim());
                } else {
                    sInput = [sInput.replace(/[\[\]'"]/g, '').trim()];
                }
            }
            // Filter valid 24-char IDs
            const cleanedServicesIds = Array.isArray(sInput) ? sInput.filter(s => s && s.length === 24) : [];

            if (cleanedServicesIds.length > 0) {
                const servicesFound = await Service.find({ _id: { $in: cleanedServicesIds } });
                if (servicesFound.length) {
                    appointment.totalPrice = servicesFound.reduce((acc, curr) => acc + curr.price, 0);
                    // Assignments would normally be updated here as well
                }
            }
        }

        if (clientEmail && clientName) {
            let client = await User.findOne({ 
                $or: [
                    { phone: clientPhone },
                    { email: clientEmail.trim() !== "" ? clientEmail : "no-email@provided.com" }
                ], 
                role: 'User' 
            });

            if (!client) {
                client = await User.create({ name: clientName, email: clientEmail, phone: clientPhone, role: 'User' });
            } else {
                if (clientPhone) client.phone = clientPhone;
                if (clientEmail) client.email = clientEmail;
                if (clientName) client.name = clientName;
                await client.save();
            }
            appointment.client = client._id;
        }

        if (date) {
            const normalizedDate = moment(date, ["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY", moment.ISO_8601], true);
            if (!normalizedDate.isValid()) {
                return res.status(400).json({ message: 'Updated temporal coordinates are invalid. Ensure DD/MM/YYYY or YYYY-MM-DD.' });
            }
            appointment.appointmentDate = normalizedDate.toDate();
        }

        appointment.status = status || appointment.status;
        appointment.paymentStatus = paymentStatus || appointment.paymentStatus;

        const updatedApp = await (await appointment.save()).populate(['client', 'assignments.service', 'assignments.staff']);
        res.json(updatedApp);
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

const updateAppointmentStatus = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
        appointment.status = req.body.status || appointment.status;
        appointment.paymentStatus = req.body.paymentStatus || appointment.paymentStatus;
        const updatedApp = await (await appointment.save()).populate(['client', 'assignments.service', 'assignments.staff']);
        res.json(updatedApp);
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

const getOccupiedSlots = async (req, res) => {
    try {
        const { date, serviceIds, staffIds } = req.method === 'POST' ? req.body : req.query;
        if (!date || !serviceIds) {
            return res.status(400).json({ message: 'Temporal coordinates and Ritual parameters are required for matrix analysis.' });
        }

        // Standardize input as arrays
        const requestedServices = Array.isArray(serviceIds) 
            ? serviceIds 
            : serviceIds.split(',').filter(id => id.length === 24);
        
        const rawStaffIds = Array.isArray(staffIds) 
            ? staffIds 
            : (staffIds ? staffIds.split(',').filter(id => id.length === 24) : []);

        // DEDUPLICATION PROTOCOL: Ensure we only check unique specialists
        const requestedStaffIds = [...new Set(rawStaffIds)];

        const normalizedDate = moment(date, ["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY", moment.ISO_8601], true);
        if (!normalizedDate.isValid()) {
            return res.status(400).json({ message: 'Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD.' });
        }

        const targetDateStart = normalizedDate.clone().startOf('day').toDate();
        const targetDateEnd = normalizedDate.clone().endOf('day').toDate();

        const services = await Service.find({ _id: { $in: requestedServices } });
        const totalDuration = services.reduce((acc, s) => acc + (s.duration || 30), 0);
        const requiredDurationMs = totalDuration * 60 * 1000;

        // 1. Identify Elite Staff (Qualified and Active)
        let qualifiedStaff;
        const staffQuery = { role: 'Staff', isActive: true };
        if (requestedStaffIds.length > 0) {
            staffQuery._id = { $in: requestedStaffIds };
        } else {
            staffQuery.services = { $all: requestedServices };
        }
        qualifiedStaff = await User.find(staffQuery);

        if (qualifiedStaff.length === 0) {
            return res.json({ allOccupied: true, message: 'No qualified specialists found for these services' });
        }

        const staffIdsArr = qualifiedStaff.map(s => s._id);

        // 2. Aggregate Busy Intervals (Appointments + Approved Leaves)
        const Leave = require('../models/Leave');
        const [dayAppointments, dayLeaves] = await Promise.all([
            Appointment.find({
                'assignments.staff': { $in: staffIdsArr },
                appointmentDate: { $gte: targetDateStart, $lte: targetDateEnd },
                status: { $nin: ['Cancelled', 'No Show'] }
            }).populate('assignments.service'),
            Leave.find({
                staff: { $in: staffIdsArr },
                status: 'Approved',
                startDate: { $lte: targetDateEnd },
                endDate: { $gte: targetDateStart }
            })
        ]);

        const staffIntervals = {};
        staffIdsArr.forEach(id => staffIntervals[id.toString()] = []);

        // Add Leave Intervals
        dayLeaves.forEach(lv => {
            const sid = lv.staff.toString();
            if (!staffIntervals[sid]) return;

            // Handle partial day leaves
            let start = lv.startDate < targetDateStart ? targetDateStart.getTime() : lv.startDate.getTime();
            let end = lv.endDate > targetDateEnd ? targetDateEnd.getTime() : lv.endDate.getTime();

            if (lv.startTime) {
                const [h, m] = lv.startTime.split(':');
                const tS = normalizedDate.clone().set({ hour: parseInt(h), minute: parseInt(m), second: 0, millisecond: 0 }).toDate().getTime();
                start = Math.max(start, tS);
            }
            if (lv.endTime) {
                const [h, m] = lv.endTime.split(':');
                const tE = normalizedDate.clone().set({ hour: parseInt(h), minute: parseInt(m), second: 0, millisecond: 0 }).toDate().getTime();
                end = Math.min(end, tE);
            }
            staffIntervals[sid].push({ start, end });
        });

        // Add Appointment Intervals
        dayAppointments.forEach(app => {
            const appStart = new Date(app.appointmentDate).getTime();
            const appDuration = app.assignments.reduce((acc, a) => acc + (a.service?.duration || 30), 0) * 60 * 1000;
            const appEnd = appStart + appDuration;

            app.assignments.forEach(a => {
                const sid = a.staff.toString();
                if (staffIntervals[sid]) {
                    staffIntervals[sid].push({ start: appStart, end: appEnd });
                }
            });
        });

        // 3. Define Analysis Matrix (9:00 AM to 7:00 PM every 30 mins)
        const timeSlots = [];
        for (let hour = 9; hour < 20; hour++) {
            timeSlots.push(normalizedDate.clone().set({ hour, minute: 0, second: 0, millisecond: 0 }).toDate());
            timeSlots.push(normalizedDate.clone().set({ hour, minute: 30, second: 0, millisecond: 0 }).toDate());
        }
        timeSlots.push(normalizedDate.clone().set({ hour: 20, minute: 0, second: 0, millisecond: 0 }).toDate());

        // 4. Analysis Protocol: Filter Occupied Slots
        const occupiedSlots = timeSlots.filter(slot => {
            // Availability Matrix Protocol: Check specialist availability for the full session duration
            const sStart = slot.getTime();
            const sEnd = sStart + requiredDurationMs;

            const availableStaffCount = qualifiedStaff.filter(stf => {
                const busy = staffIntervals[stf._id.toString()] || [];
                return !busy.some(b => (sStart < b.end && sEnd > b.start));
            }).length;

            if (requestedStaffIds.length > 0) {
                // If user picked specific staff, ALL of them must be available
                return availableStaffCount < requestedStaffIds.length;
            } else {
                // Auto-assign: At least one qualified person must be available
                return availableStaffCount === 0;
            }
        }).map(slot => slot.toISOString());

        res.json({ occupiedSlots });
    } catch (err) {
        console.error("SLOT_ENGINE_ERR:", err);
        res.status(500).json({ message: 'Dynamic slot analysis phase failed', error: err.message });
    }
};

const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ client: req.user._id })
            .populate('assignments.service')
            .populate('assignments.staff', 'name email phone avatar')
            .sort({ appointmentDate: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'History retrieval failed', error: error.message });
    }
};

module.exports = { 
    createAppointment, 
    getAppointments, 
    getMyAppointments,
    updateAppointmentStatus, 
    updateAppointment, 
    deleteAppointment, 
    getOccupiedSlots 
};
