const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    customId: { type: String, unique: true, sparse: true }, // SKU-style ID: ADM-NAME-1234
    password: { type: String }, // Required for Admin/others who login
    role: { 
        type: String, 
        enum: ['Admin', 'Staff', 'User'], 
        default: 'User' 
    },
    phone: { type: String },
    profileImage: { type: String },
    
    // Staff specific fields
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    isActive: { type: Boolean, default: true },

    // Client/User specific fields
    bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],

    // Admin specific fields (Salon Info)
    salonInfo: {
        name: { type: String, default: 'Luxury Saloon' },
        logo: { type: String },
        contact: { type: String },
        workingHours: { type: String }
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    // Generate Custom SKU-style ID if not exists
    if (!this.customId) {
        const prefixMap = {
            'Admin': 'ADM',
            'Staff': 'STF',
            'User': 'CLI'
        };
        const prefix = prefixMap[this.role] || 'CLI';
        const namePart = (this.name || 'CLI').replace(/[^a-zA-Z]/g, '').padEnd(4, 'X').substring(0, 4).toUpperCase();
        const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random
        this.customId = `${prefix}-${namePart}-${randomPart}`;
    }

    if (!this.isModified('password')) return next();
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
