const User = require('../models/User');
const { deleteFromS3 } = require('../utils/s3Utils');

// @desc Get all clients
const getClients = async (req, res) => {
    const clients = await User.find({ role: 'User' }).sort({ createdAt: -1 }).populate('bookingHistory');
    res.json(clients);
};

// @desc Get client by ID
const getClientById = async (req, res) => {
    const client = await User.findOne({ _id: req.params.id, role: 'User' });
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

    const clientExists = await User.findOne({ 
        role: 'User',
        $or: [{ email }, { phone }] 
    });

    if (clientExists) {
        return res.status(400).json({ 
            message: clientExists.email === email ? 'Digital identity (Email) already exists' : 'Contact tether (Phone) already exists' 
        });
    }

    const client = new User({ name, email, phone, profileImage, role: 'User' });
    const createdClient = await client.save();
    res.status(201).json(createdClient);
};

// @desc Update client
const updateClient = async (req, res) => {
    const { name, email, phone } = req.body;
    let profileImage = req.body.profileImage; // From uploadMiddleware if new, else from body
    
    const targetClient = await User.findOne({ _id: req.params.id, role: 'User' });
    if (targetClient) {
        // Validation check for collisions with other clients
        const collisionCheck = await User.findOne({
            role: 'User',
            _id: { $ne: req.params.id },
            $or: [{ email }, { phone }]
        });

        if (collisionCheck) {
            return res.status(400).json({ 
                message: collisionCheck.email === email ? 'Updated Email already assigned' : 'Updated Phone already linked' 
            });
        }

        // If image changed, delete old one from S3
        if (profileImage && targetClient.profileImage && profileImage !== targetClient.profileImage) {
            await deleteFromS3(targetClient.profileImage);
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
    const client = await User.findOne({ _id: req.params.id, role: 'User' });
    if (client) {
        // Delete image from S3 before removing record
        if (client.profileImage) {
            await deleteFromS3(client.profileImage);
        }
        
        await client.deleteOne();
        res.json({ message: 'Client record and identity purged from S3' });
    } else {
        res.status(404).json({ message: 'Client not found' });
    }
};

module.exports = { getClients, getClientById, createClient, updateClient, deleteClient };
