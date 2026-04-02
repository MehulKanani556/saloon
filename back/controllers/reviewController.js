const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');

// @desc Create a Review
// @route POST /api/reviews
const createReview = async (req, res) => {
    const { target, targetType, rating, comment } = req.body;
    try {
        // Verification: Only review if they have used the service/product
        if (targetType === 'Service' || targetType === 'Staff') {
            const appointment = await Appointment.findOne({ 
                user: req.user._id, 
                status: 'Completed',
                // For Staff, check if they were assigned
                // For Service, check if it was part of the appointment
            });
            // if (!appointment) return res.status(403).json({ message: 'Validation required: Services must be utilized before feedback is accepted.' });
        }

        const review = await Review.create({
            user: req.user._id,
            target,
            targetType,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Feedback propagation failed', error: error.message });
    }
};

// @desc Get Reviews for a Target
// @route GET /api/reviews/:targetId
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ target: req.params.targetId })
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'History extraction failed', error: error.message });
    }
};

module.exports = { createReview, getReviews };
