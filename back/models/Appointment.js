const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentId: { type: String, unique: true, sparse: true }, // SKU-style ID: APT-DDMMYY-1234
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignments: [{
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    appointmentDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

appointmentSchema.pre('save', async function (next) {
    if (!this.appointmentId) {
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const datePart = `${dd}${mm}${yy}`;
        const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random
        this.appointmentId = `APT-${datePart}-${randomPart}`;
    }
    next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
    