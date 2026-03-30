const Appointment = require('../models/Appointment');
const Client = require('../models/Client');
const Service = require('../models/Service');

const createAppointment = async (req, res) => {
    const { clientEmail, clientName, clientPhone, services, date, status, paymentStatus } = req.body;

    // Fetch services to calculate total price
    const servicesFound = await Service.find({ _id: { $in: services } });
    if (!servicesFound.length) {
        return res.status(404).json({ message: 'Ritual components not found' });
    }

    const totalPrice = servicesFound.reduce((acc, curr) => acc + curr.price, 0);

    let client = await Client.findOne({ email: clientEmail });
    if (!client) {
        client = await Client.create({ name: clientName, email: clientEmail, phone: clientPhone });
    } else if (clientPhone) {
        client.phone = clientPhone;
        await client.save();
    }
    const appointment = new Appointment({
        client: client._id,
        services,
        appointmentDate: date,
        status: status || 'Pending',
        paymentStatus: paymentStatus || 'Pending',
        totalPrice
    });
    const createdAppointment = await (await appointment.save()).populate(['client', 'services']);
    client.bookingHistory.push(createdAppointment._id);
    await client.save();
    res.status(201).json(createdAppointment);
};

const getAppointments = async (req, res) => {
    const appointments = await Appointment.find({}).populate('client').populate('services');
    res.json(appointments);
};

const deleteAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
        if (appointment.client) {
            await Client.findByIdAndUpdate(appointment.client, {
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
            let client = await Client.findOne({ email: clientEmail });
            if (!client) {
                client = await Client.create({ name: clientName, email: clientEmail, phone: clientPhone });
            } else if (clientPhone) {
                client.phone = clientPhone;
                await client.save();
            }
            appointment.client = client._id;
        }

        appointment.appointmentDate = date || appointment.appointmentDate;
        appointment.status = status || appointment.status;
        appointment.paymentStatus = paymentStatus || appointment.paymentStatus;

        const updatedApp = await (await appointment.save()).populate(['client', 'services']);
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
        const updatedApp = await (await appointment.save()).populate(['client', 'services']);
        res.json(updatedApp);
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

module.exports = { createAppointment, getAppointments, updateAppointmentStatus, updateAppointment, deleteAppointment };
