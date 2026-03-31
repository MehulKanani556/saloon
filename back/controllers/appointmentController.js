const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');

const createAppointment = async (req, res) => {
    const { clientEmail, clientName, clientPhone, services, assignments, date, status, paymentStatus } = req.body;

    // 1. Resolve Services and Assignments
    // If assignments provided: [{ service: 'id', staff: 'id' }]
    // If only services provided: [{ service: 'id' }] -> need to auto-assign staff
    let finalAssignments = assignments || [];
    const serviceIds = services || finalAssignments.map(a => a.service);

    const servicesFound = await Service.find({ _id: { $in: serviceIds } });
    if (!servicesFound.length) {
        return res.status(404).json({ message: 'Ritual components not found' });
    }

    const totalPrice = servicesFound.reduce((acc, curr) => acc + curr.price, 0);
    const requestedTime = new Date(date);

    // 2. Handle Auto-Assignment if needed
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
    let client = await User.findOne({ phone: clientPhone, role: 'User' });
    if (!client) {
        client = await User.create({ name: clientName, email: clientEmail, phone: clientPhone, role: 'User' });
    } else if (clientPhone) {
        client.phone = clientPhone;
        await client.save();
    }

    const appointment = new Appointment({
        client: client._id,
        assignments: finalAssignments,
        appointmentDate: date,
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
    const appointments = await Appointment.find({}).populate('client').populate('assignments.service').populate('assignments.staff');
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
        if (services && Array.isArray(services) && services.length > 0) {
            const servicesFound = await Service.find({ _id: { $in: services } });
            if (servicesFound.length) {
                appointment.totalPrice = servicesFound.reduce((acc, curr) => acc + curr.price, 0);
                appointment.services = services;
            }
        }

        if (clientEmail && clientName) {
            let client = await User.findOne({ email: clientEmail, role: 'User' });
            if (!client) {
                client = await User.create({ name: clientName, email: clientEmail, phone: clientPhone, role: 'User' });
            } else if (clientPhone) {
                client.phone = clientPhone;
                await client.save();
            }
            appointment.client = client._id;
        }

        appointment.appointmentDate = date || appointment.appointmentDate;
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

        const [year, month, day] = date.split('-').map(Number);
        const targetDate = new Date(Date.UTC(year, month - 1, day));
        const nextDate = new Date(Date.UTC(year, month - 1, day + 1));

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
        for (let hour = 0; hour < 24; hour++) {
            [0, 30].forEach(min => {
                timeSlots.push(new Date(Date.UTC(year, month - 1, day, hour, min)));
            });
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
