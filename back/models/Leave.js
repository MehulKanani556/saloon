const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String }, // e.g., "09:00"
    endTime: { type: String }, // e.g., "17:00"
    totalHours: { type: Number },
    type: {
        type: String,
        enum: ['Sick Leave', 'Casual Leave', 'Emergency Leave'],
        default: 'Casual Leave'
    },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    adminComment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
