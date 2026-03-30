const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');

const getServices = async (req, res) => {
    const services = await Service.find({}).populate('category');
    res.json(services);
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
        // If image changed, delete old one
        if (image && service.image && image !== service.image) {
            const oldPath = path.join(__dirname, '..', service.image.replace(/^\/+/, ''));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
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
            const imagePath = path.join(__dirname, '..', service.image.replace(/^\/+/, ''));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await service.deleteOne();
        res.json({ message: 'Service and physical masterpiece removed' });
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
};

module.exports = { getServices, createService, updateService, deleteService };
