const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const moment = require('moment');

const createAppointment = async (req, res) => {
    const { clientEmail, clientName, clientPhone, services, assignments, date, status, paymentStatus } = req.body;

    // 1. Resolve Services and Assignments
    let finalAssignments = assignments || [];
    let serviceIds = services || finalAssignments.map(a => a.service);

    // Robust parsing for serviceIds from form-data or mixed inputs
    if (serviceIds && typeof serviceIds === 'string') {
        if (serviceIds.includes(',')) {
            serviceIds = serviceIds.split(',').map(s => s.replace(/[\[\]'"]/g, '').trim());
        } else {
            serviceIds = [serviceIds.replace(/[\[\]'"]/g, '').trim()];
        }
    }

    // Ensure it's an array and filter valid 24-char IDs
    serviceIds = Array.isArray(serviceIds) ? serviceIds.filter(s => s && s.length === 24) : [];

    // 2. Validate Temple Coordinates (Date)
    const normalizedDate = moment(date, ["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY", moment.ISO_8601], true);
    if (!date || !normalizedDate.isValid()) {
        return res.status(400).json({ message: 'Temporal coordinates are invalid or missing. Ensure format is DD/MM/YYYY or YYYY-MM-DD.' });
    }

    if (serviceIds.length === 0) {
        return res.status(400).json({ message: 'At least one ritual component (service) is required' });
    }

    const servicesFound = await Service.find({ _id: { $in: serviceIds } });
    if (!servicesFound.length) {
        return res.status(404).json({ message: 'Ritual components not found' });
    }

    const totalPrice = servicesFound.reduce((acc, curr) => acc + curr.price, 0);
    const requestedTime = normalizedDate.toDate();

    // 3. Handle Auto-Assignment if needed
    if (finalAssignments.length === 0 || !finalAssignments[0].staff) {
        // Find qualified staff who can do ALL rituals
        const eligibleStaff = await User.find({
            role: 'Staff',
            isActive: true,
            services: { $all: serviceIds }
        });

        let assignedStaffId = null;
        for (const stf of eligibleStaff) {
            const conflict = await Appointment.findOne({
                'assignments.staff': stf._id,
                appointmentDate: requestedTime,
                status: { $ne: 'Cancelled' }
            });
            if (!conflict) {
                assignedStaffId = stf._id;
                break;
            }
        }

        if (!assignedStaffId) {
            return res.status(400).json({ message: 'All qualified masters are occupied during this temporal slot' });
        }

        finalAssignments = serviceIds.map(sid => ({ service: sid, staff: assignedStaffId }));
    } else {
        // Verify user-selected staff availability
        for (const asm of finalAssignments) {
            const conflict = await Appointment.findOne({
                'assignments.staff': asm.staff,
                appointmentDate: requestedTime,
                status: { $ne: 'Cancelled' }
            });
            if (conflict) {
                return res.status(400).json({ message: 'One of the selected masters has been reserved in the meantime' });
            }
        }
    }

    // 3. SECURE Client Profile
    let client = await User.findOne({ 
        $or: [
            { phone: clientPhone },
            { email: clientEmail && clientEmail.trim() !== "" ? clientEmail : "" }
        ], 
        role: 'User' 
    });

    if (!client) {
        client = await User.create({ name: clientName, email: clientEmail, phone: clientPhone, role: 'User' });
    } else {
        // Update details if they've changed
        if (clientPhone) client.phone = clientPhone;
        if (clientEmail) client.email = clientEmail;
        if (clientName) client.name = clientName;
        await client.save();
    }

    const appointment = new Appointment({
        client: client._id,
        assignments: finalAssignments,
        appointmentDate: requestedTime,
        status: status || 'Pending',
        paymentStatus: paymentStatus || 'Pending',
        totalPrice
    });

    const createdAppointment = await (await appointment.save()).populate(['client', 'assignments.service', 'assignments.staff']);
    client.bookingHistory.push(createdAppointment._id);
    await client.save();
    res.status(201).json(createdAppointment);
};

const getAppointments = async (req, res) => {
    const isStaff = req.user.role === 'Staff';
    const filter = isStaff ? { 'assignments.staff': req.user._id } : {};
    const appointments = await Appointment.find(filter).populate('client').populate('assignments.service').populate('assignments.staff');
    res.json(appointments);
};

const deleteAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
        if (appointment.client) {
            await User.findByIdAndUpdate(appointment.client, {
                $pull: { bookingHistory: appointment._id }
            });
        }
        await appointment.deleteOne();
        res.json({ message: 'Appointment dissolved, client profile preserved.' });
    } else {
        res.status(404).json({ message: 'Appointment not found' });
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
        const { date, serviceIds, staffIds } = req.query;
        if (!date || !serviceIds) {
            return res.status(400).json({ message: 'Temporal coordinates and rituals required for analysis' });
        }

        const requestedServices = serviceIds.split(',');
        const requestedStaffIds = staffIds ? staffIds.split(',') : null;

        const normalizedDate = moment(date, ["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY", moment.ISO_8601], true);
        if (!normalizedDate.isValid()) {
            return res.status(400).json({ message: 'Target temporal window is invalid. Ensure DD/MM/YYYY or YYYY-MM-DD.' });
        }

        const targetDate = normalizedDate.clone().startOf('day').toDate();
        const nextDate = normalizedDate.clone().add(1, 'days').startOf('day').toDate();

        const rituals = await Service.find({ _id: { $in: requestedServices } });
        const totalDuration = rituals.reduce((acc, curr) => acc + curr.duration, 0);

        // Find relevant staff
        let qualifiedStaff;
        if (requestedStaffIds && requestedStaffIds.length > 0) {
            // User picked specific staff - check only those
            qualifiedStaff = await User.find({
                _id: { $in: requestedStaffIds },
                role: 'Staff',
                isActive: true
            });
        } else {
            // Auto-assign: Find all who can do ALL rituals
            qualifiedStaff = await User.find({
                role: 'Staff',
                isActive: true,
                services: { $all: requestedServices }
            });
        }

        if (qualifiedStaff.length === 0) {
            return res.json({ allOccupied: true, message: 'No masters qualified for this ritual' });
        }

        const appointments = await Appointment.find({
            'assignments.staff': { $in: qualifiedStaff.map(s => s._id) },
            appointmentDate: { $gte: targetDate, $lt: nextDate },
            status: { $ne: 'Cancelled' }
        }).populate('assignments.service');

        const staffBusyBlocks = {};
        qualifiedStaff.forEach(s => staffBusyBlocks[s._id] = []);

        appointments.forEach(app => {
            const start = new Date(app.appointmentDate).getTime();
            const durationMs = app.assignments.reduce((acc, a) => acc + (a.service?.duration || 30), 0) * 60 * 1000;
            app.assignments.forEach(a => {
                if (staffBusyBlocks[a.staff]) {
                    staffBusyBlocks[a.staff].push({ start, end: start + durationMs });
                }
            });
        });

        const timeSlots = [];
        for (let hour = 9; hour <= 19; hour++) {
            const h0 = normalizedDate.clone().hour(hour).minute(0).second(0).millisecond(0).toDate();
            timeSlots.push(h0);
            if (hour < 19) {
                const h30 = normalizedDate.clone().hour(hour).minute(30).second(0).millisecond(0).toDate();
                timeSlots.push(h30);
            }
        }

        const occupiedSlots = [];
        const requiredDurationMs = totalDuration * 60 * 1000;

        timeSlots.forEach(slot => {
            const slotStart = slot.getTime();
            const slotEnd = slotStart + requiredDurationMs;

            const freeStaff = qualifiedStaff.filter(stf => {
                const busyBlocks = staffBusyBlocks[stf._id];
                const overlaps = busyBlocks.some(block => {
                    return (slotStart < block.end && slotEnd > block.start);
                });
                return !overlaps;
            });

            // If user picked specific staff, ALL must be free
            if (requestedStaffIds && requestedStaffIds.length > 0) {
                if (freeStaff.length < qualifiedStaff.length) {
                    occupiedSlots.push(slot.toISOString());
                }
            } else {
                // Auto-assign: At least one must be free
                if (freeStaff.length === 0) {
                    occupiedSlots.push(slot.toISOString());
                }
            }
        });

        res.json({ occupiedSlots });
    } catch (err) {
        res.status(500).json({ message: 'Slot analysis failed', error: err.message });
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
