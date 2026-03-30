const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    profileImage: { type: String },
    availability: { type: String, default: 'Full-time' }, 
    ratings: { type: Number, default: 4.5 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
