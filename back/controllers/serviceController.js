const Service = require('../models/Service');
const { deleteFromS3 } = require('../utils/s3Utils');

const getServices = async (req, res) => {
    const User = require('../models/User');
    const services = await Service.find({}).populate('category').sort({ createdAt: -1 }).lean();
    const staff = await User.find({ role: 'Staff', isActive: true });

    const servicesWithStaffCount = services.map(service => {
        return {
            ...service,
            staffCount: staff.filter(s => s.services.some(sid => sid.toString() === service._id.toString())).length
        };
    });
    
    res.json(servicesWithStaffCount);
};

const createService = async (req, res) => {
    const { name, price, duration, category, image } = req.body;
    const service = new Service({ name, price, duration, category, image });
    const createdService = await service.save();
    const populatedService = await Service.findById(createdService._id).populate('category');
    res.status(201).json(populatedService);
};

const updateService = async (req, res) => {
    const { name, price, duration, category, image, isActive } = req.body;
    const service = await Service.findById(req.params.id);
    if (service) {
        // If image changed, delete old one from S3
        if (image && service.image && image !== service.image) {
            await deleteFromS3(service.image);
        }
        
        service.name = name || service.name;
        service.price = price || service.price;
        service.duration = duration || service.duration;
        service.category = category || service.category;
        service.image = image || service.image;
        service.isActive = isActive !== undefined ? isActive : service.isActive;
        const updatedService = await service.save();
        const populatedService = await Service.findById(updatedService._id).populate('category');
        res.json(populatedService);
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
};

const deleteService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (service) {
        // Delete image before removing record
        if (service.image) {
            await deleteFromS3(service.image);
        }
        
        await service.deleteOne();
        res.json({ message: 'Service and physical masterpiece removed from S3' });
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
};

module.exports = { getServices, createService, updateService, deleteService };
