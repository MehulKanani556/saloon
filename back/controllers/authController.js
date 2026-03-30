const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @desc Register Admin
// @route POST /api/auth/register
// @access Private (Admin only)
const registerAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ name, email, password, role });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

// @desc Login Admin
// @route POST /api/auth/login
// @access Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            salonInfo: admin.salonInfo,
            token: generateToken(admin._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { registerAdmin, loginAdmin };
