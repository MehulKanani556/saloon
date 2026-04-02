const SpecializationRequest = require('../models/SpecializationRequest');
const User = require('../models/User');

// @desc Create a specialization update request
// @route POST /api/specialization/request
// @access Private (Staff only)
const createSpecializationRequest = async (req, res) => {
    try {
        const { services, specialization, bio } = req.body;

        // Check if there's already a pending request
        const pendingRequest = await SpecializationRequest.findOne({ staff: req.user._id, status: 'Pending' });
        if (pendingRequest) {
            return res.status(400).json({ message: 'A pending expertise synchronization is already active. Please wait for validation.' });
        }

        const newRequest = await SpecializationRequest.create({
            staff: req.user._id,
            services,
            specialization,
            bio,
            status: 'Pending'
        });

        const { notifyAdmin } = require('../helpers/socketHelper');
        notifyAdmin('new_specialization_request', {
            id: newRequest._id,
            staff: req.user.name,
            type: 'Expertise Update'
        });

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get my specialization requests
// @route GET /api/specialization/my-requests
// @access Private (Staff only)
const getMySpecializationRequests = async (req, res) => {
    try {
        const requests = await SpecializationRequest.find({ staff: req.user._id })
            .populate('services')
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all specialization requests
// @route GET /api/specialization/all-requests
// @access Private (Admin only)
const getAllSpecializationRequests = async (req, res) => {
    try {
        const requests = await SpecializationRequest.find()
            .populate({
                path: 'staff',
                select: 'name profileImage services',
                populate: {
                    path: 'services',
                    select: 'name'
                }
            })
            .populate('services')
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update specialization request status
// @route PUT /api/specialization/requests/:id
// @access Private (Admin only)
const updateSpecializationRequestStatus = async (req, res) => {
    try {
        const { status, adminReason } = req.body;
        const request = await SpecializationRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Expertise request not found' });
        }

        request.status = status;
        request.adminReason = adminReason;
        
        if (status === 'Approved') {
            const user = await User.findById(request.staff);
            if (user) {
                // ADDITIVE LOGIC: Merge new services with existing ones without duplicates
                const currentServiceIds = user.services.map(s => s._id?.toString() || s.toString());
                const requestedServiceIds = request.services.map(s => s.toString());
                
                // Combine and unique
                user.services = Array.from(new Set([...currentServiceIds, ...requestedServiceIds]));
                
                // Merge specializations/keywords
                const currentSpecs = user.specialization || [];
                const requestedSpecs = request.specialization || [];
                user.specialization = Array.from(new Set([...currentSpecs, ...requestedSpecs]));

                user.bio = request.bio || user.bio;
                await user.save();
            }
        }

        await request.save();
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSpecializationRequest,
    getMySpecializationRequests,
    getAllSpecializationRequests,
    updateSpecializationRequestStatus
};
