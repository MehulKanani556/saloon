const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || 'access_secret', { expiresIn: '1m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
};

// @desc Register Admin
// @route POST /api/auth/register
// @access Public
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({ name, email, password });

        if (admin) {
            const accessToken = generateAccessToken(admin._id);
            const refreshToken = generateRefreshToken(admin._id);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                salonInfo: admin.salonInfo,
                accessToken
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login Admin
// @route POST /api/auth/login
// @access Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            const accessToken = generateAccessToken(admin._id);
            const refreshToken = generateRefreshToken(admin._id);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                salonInfo: admin.salonInfo,
                accessToken
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Refresh Token
// @route POST /api/auth/refresh
// @access Public
const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.refreshToken;

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const admin = await Admin.findById(decoded.id);
            if (!admin) return res.status(401).json({ message: 'Unauthorized' });

            const accessToken = generateAccessToken(admin._id);
            res.json({ accessToken });
        }
    );
};

// @desc Logout Admin
// @route POST /api/auth/logout
// @access Public
const logoutAdmin = (req, res) => {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', { 
        httpOnly: true, 
        sameSite: 'strict', 
        secure: process.env.NODE_ENV === 'production' 
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerAdmin, loginAdmin, refresh, logoutAdmin };
