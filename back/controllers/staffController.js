const User = require('../models/User');
const Service = require('../models/Service');
const { deleteFromS3 } = require('../utils/s3Utils');

const getStaff = async (req, res) => {
    const staff = await User.find({ role: 'Staff' }).populate('services');
    res.json(staff);
};

const createStaff = async (req, res) => {
    try {
        // Automatically trim all string fields in the body
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });

        let { name, email, services, profileImage, phone } = req.body;

        console.log('[DEBUG] Sanitized services raw (Create):', services);

        // Ultra-robust parsing for services
        if (services) {
            if (typeof services === 'string') {
                // If it contains a comma, split first, then clean each ID
                if (services.includes(',')) {
                    services = services.split(',').map(s => s.replace(/[\[\]'"]/g, '').trim());
                } else {
                    // Single ID: remove any accidental brackets/quotes
                    services = [services.replace(/[\[\]'"]/g, '').trim()];
                }
            }
        }

        // Filter valid 24-char IDs
        services = Array.isArray(services) ? services.filter(s => s && s.length === 24) : [];

        console.log('[DEBUG] Final IDs to process (Create):', services);

        // Verify if IDs exist in Services collection
        for (const id of services) {
            const exists = await Service.findById(id);
            console.log(`[CHECK] Create ID ${id} exists in Services: ${!!exists}`);
        }

        const staff = new User({ name, email, services, profileImage, phone, role: 'Staff' });
        const createdStaff = await staff.save();
        
        // Use a clean retrieval for reliable population
        const populatedStaff = await User.findById(createdStaff._id).populate('services');
        
        console.log('[DEBUG] Response services count:', populatedStaff.services.length);
        res.status(201).json(populatedStaff);

    } catch (error) {
        console.error('[ERROR] createStaff failed:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Identity Conflict: This email or ID already exists.' });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateStaff = async (req, res) => {
    try {
        const staff = await User.findOne({ _id: req.params.id, role: 'Staff' });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        // Trim input
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });

        let sInput = req.body.services;
        if (sInput) {
            console.log('[DEBUG] Sanitized services raw (Update):', sInput);
            if (typeof sInput === 'string') {
                if (sInput.includes(',')) {
                    sInput = sInput.split(',').map(s => s.replace(/[\[\]'"]/g, '').trim());
                } else {
                    sInput = [sInput.replace(/[\[\]'"]/g, '').trim()];
                }
            }
        const cleanedServices = Array.isArray(sInput) ? sInput.filter(s => s && s.length === 24) : [];
            
            console.log('[DEBUG] Final IDs to process (Update):', cleanedServices);

            // Verify if IDs exist in Services collection (Strict Check)
            const validServices = [];
            for (const id of cleanedServices) {
                const exists = await Service.findById(id);
                if (!exists) {
                    return res.status(400).json({ message: `Linked service with ID ${id} was not found in the database. Please verify the ID.` });
                }
                validServices.push(id);
            }
            
            staff.services = validServices;
        }

        staff.name = req.body.name || staff.name;
        staff.email = req.body.email || staff.email;
        staff.phone = req.body.phone || staff.phone;
        staff.profileImage = req.body.profileImage || staff.profileImage;
        staff.isActive = req.body.isActive !== undefined ? req.body.isActive : staff.isActive;
        
        await staff.save();
        
        // Use a clean retrieval for reliable population
        const updatedStaff = await User.findById(req.params.id).populate('services');
        res.json(updatedStaff);
    } catch (error) {
        console.error('[ERROR] updateStaff failed:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Update Conflict: Email already in use.' });
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteStaff = async (req, res) => {
    const staff = await User.findOne({ _id: req.params.id, role: 'Staff' });
    if (staff) {
        // Delete image from S3 before removing record
        if (staff.profileImage) {
            await deleteFromS3(staff.profileImage);
        }

        await staff.deleteOne();
        res.json({ message: 'Staff removed and image purged from S3' });
    } else {
        res.status(404).json({ message: 'Staff not found' });
    }
};

module.exports = { getStaff, createStaff, updateStaff, deleteStaff };
