const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    salonName: { type: String, default: 'Glow & Elegance Premium Saloon' },
    tagline: { type: String, default: 'Crafting Your Perfect Style' },
    email: { type: String, default: 'contact@glowelegance.com' },
    phone: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: '123, Luxury Lane, Diamond District, Mumbai - 400001' },
    logo: { type: String, default: '' },
    businessHours: [{
        day: String,
        open: String,
        close: String,
        isOpen: { type: Boolean, default: true }
    }],
    paymentMethods: [{
        name: String,
        isActive: { type: Boolean, default: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
