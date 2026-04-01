const mongoose = require('mongoose');

const specializationRequestSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    specialization: [String],
    bio: String,
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    adminReason: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('SpecializationRequest', specializationRequestSchema);
