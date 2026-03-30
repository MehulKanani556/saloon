const Client = require('../models/Client');
const fs = require('fs');
const path = require('path');

// @desc Get all clients
const getClients = async (req, res) => {
    const clients = await Client.find({}).sort({ createdAt: -1 }).populate('bookingHistory');
    res.json(clients);
};

// @desc Get client by ID
const getClientById = async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (client) {
        res.json(client);
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

// @desc Create new client
const createClient = async (req, res) => {
    const { name, email, phone } = req.body;
    let profileImage = req.body.profileImage || ''; // Populated by uploadMiddleware if image uploaded

    const clientExists = await Client.findOne({ 
        $or: [{ email }, { phone }] 
    });

    if (clientExists) {
        return res.status(400).json({ 
            message: clientExists.email === email ? 'Digital identity (Email) already exists' : 'Contact tether (Phone) already exists' 
        });
    }

    const client = new Client({ name, email, phone, profileImage });
    const createdClient = await client.save();
    res.status(201).json(createdClient);
};

// @desc Update client
const updateClient = async (req, res) => {
    const { name, email, phone } = req.body;
    let profileImage = req.body.profileImage; // From uploadMiddleware if new, else from body
    
    const targetClient = await Client.findById(req.params.id);
    if (targetClient) {
        // Validation check for collisions with other clients
        const collisionCheck = await Client.findOne({
            _id: { $ne: req.params.id },
            $or: [{ email }, { phone }]
        });

        if (collisionCheck) {
            return res.status(400).json({ 
                message: collisionCheck.email === email ? 'Updated Email already assigned' : 'Updated Phone already linked' 
            });
        }

        // If image changed, delete old one
        if (profileImage && targetClient.profileImage && profileImage !== targetClient.profileImage) {
            const oldPath = path.join(__dirname, '..', targetClient.profileImage.replace(/^\/+/, ''));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        targetClient.name = name || targetClient.name;
        targetClient.email = email || targetClient.email;
        targetClient.phone = phone || targetClient.phone;
        targetClient.profileImage = profileImage || targetClient.profileImage;
        
        const updatedClient = await targetClient.save();
        res.json(updatedClient);
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

// @desc Delete client
const deleteClient = async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (client) {
        // Delete image before removing record
        if (client.profileImage) {
            const imagePath = path.join(__dirname, '..', client.profileImage.replace(/^\/+/, ''));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await client.deleteOne();
        res.json({ message: 'Client record and identity purged' });
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

module.exports = { getClients, getClientById, createClient, updateClient, deleteClient };
