const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        qty: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        zipCode: String,
        country: String
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    orderId: {
        type: String,
        unique: true
    },
    paymentIntentId: {
        type: String
    }
}, { timestamps: true });

// Generate a random Order ID like ORD-1234-ABCD
orderSchema.pre('save', async function (next) {
    if (!this.orderId) {
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        this.orderId = `ORD-${randomNumber}-${randomStr}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
