const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in minutes
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
