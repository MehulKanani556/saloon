const User = require('../models/User');
const { deleteFromS3 } = require('../utils/s3Utils');

const getStaff = async (req, res) => {
    const staff = await User.find({ role: 'Staff' }).populate('services');
    res.json(staff);
};

const createStaff = async (req, res) => {
    let { name, email, services, profileImage, availability, ratings } = req.body;
    if (services) {
        services = Array.isArray(services) ? services : [services];
    }
    const staff = new User({ name, email, services, profileImage, availability, ratings, role: 'Staff' });
    let createdStaff = await staff.save();
    createdStaff = await createdStaff.populate('services');
    res.status(201).json(createdStaff);
};

const updateStaff = async (req, res) => {
    const staff = await User.findOne({ _id: req.params.id, role: 'Staff' });
    if (staff) {
        // If image changed, delete old one from S3
        if (req.body.profileImage && staff.profileImage && req.body.profileImage !== staff.profileImage) {
            await deleteFromS3(staff.profileImage);
        }
        
        if (req.body.services) {
            staff.services = Array.isArray(req.body.services) ? req.body.services : [req.body.services];
        }
        
        staff.name = req.body.name || staff.name;
        staff.email = req.body.email || staff.email;
        staff.profileImage = req.body.profileImage || staff.profileImage;
        staff.availability = req.body.availability || staff.availability;
        staff.ratings = req.body.ratings || staff.ratings;
        staff.isActive = req.body.isActive !== undefined ? req.body.isActive : staff.isActive;
        let updatedStaff = await staff.save();
        updatedStaff = await updatedStaff.populate('services');
        res.json(updatedStaff);
    } else {
        res.status(404).json({ message: 'Staff not found' });
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
