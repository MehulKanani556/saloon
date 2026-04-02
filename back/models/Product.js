const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Skincare', 'Fragrance', 'Haircare', 'Accessories', 'Grooming']
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 10
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
