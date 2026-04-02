const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true }, // Service, Staff, or Product
    targetType: { 
        type: String, 
        enum: ['Service', 'Staff', 'Product'], 
        required: true 
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: true } // Admin can moderate if needed
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
