const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
    appointmentDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
