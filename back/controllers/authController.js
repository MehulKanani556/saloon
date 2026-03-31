const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmailOTP, sendSMSOTP } = require('../helpers/otpHelper');

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || 'access_secret', { expiresIn: '1m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
};

// @desc Register User (Client)
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create as regular User (Client) by default
        const user = await User.create({ name, email, password, role: 'User' });

        if (user) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                salonInfo: user.salonInfo,
                accessToken
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Send OTP to User
// @route POST /api/auth/send-otp
// @access Public
const sendOTP = async (req, res) => {
    const { identity } = req.body; // mobile or email

    try {
        const isEmail = identity.includes('@');
        const query = isEmail ? { email: identity } : { phone: identity };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use fixed OTP for testing as requested by user's manual edit
        const otp = '123456';
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Relay logic disabled for testing as requested by user's manual edit
        console.log(`Test OTP for ${identity}: ${otp}`);

        res.status(200).json({ message: 'OTP sent successfully (Test Mode: 123456)' });
    } catch (error) {
        console.error('OTP Sending Error:', error);
        res.status(500).json({ message: error.message || 'System failed to relay code. Operation aborted.' });
    }
};

// @desc Login User (Admin, Staff, or Client)
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    const { identity, password, otp, method } = req.body;

    try {
        const query = identity.includes('@') ? { email: identity } : { phone: identity };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let isAuth = false;

        if (method === 'password') {
            isAuth = await user.matchPassword(password);
        } else if (method === 'otp') {
            isAuth = user.otp === otp && user.otpExpires > Date.now();
            if (isAuth) {
                user.otp = undefined;
                user.otpExpires = undefined;
                await user.save();
            }
        }

        if (isAuth) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                salonInfo: user.salonInfo,
                accessToken
            });
        } else {
            res.status(401).json({ message: method === 'password' ? 'Invalid password' : 'Invalid or expired OTP' });
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

            const user = await User.findById(decoded.id);
            if (!user) return res.status(401).json({ message: 'Unauthorized' });

            const accessToken = generateAccessToken(user._id);
            res.json({ accessToken });
        }
    );
};

// @desc Logout User
// @route POST /api/auth/logout
// @access Public
const logoutUser = (req, res) => {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc Update Profile
// @route PUT /api/auth/profile
// @access Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                customId: updatedUser.customId,
                accessToken: generateAccessToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'Identity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, refresh, logoutUser, sendOTP, updateUserProfile };
