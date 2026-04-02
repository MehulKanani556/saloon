const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmailOTP, sendSMSOTP } = require('../helpers/otpHelper');

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
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
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
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

        // Generate a 100% random 6-digit code for maximum security
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes window
        await user.save();

        // Dispatch OTP through appropriate relay (Email or SMS)
        if (isEmail) {
            await sendEmailOTP(user.email, otp);
        } else {
            // Note: phone number must start with + for Twilio (e.g., +91, +1)
            const formattedPhone = user.phone.startsWith('+') ? user.phone : `+${user.phone}`;
            await sendSMSOTP(formattedPhone, otp);
        }

        res.status(200).json({ message: 'A secure verification code has been dispatched. Authenticate within 10 minutes.' });
    } catch (error) {
        console.error('OTP Dispatch Error:', error);
        res.status(500).json({ message: 'System failed to relay code: ' + (error.message || 'Verification relay failed.') });
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

        if (user.isDeleted) {
            return res.status(401).json({ message: 'This identity has been dissolved. Access denied.' });
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
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                salonInfo: user.salonInfo,
                customId: user.customId,
                profileImage: user.profileImage,
                leaveBalance: user.leaveBalance,
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
            if (!user || user.isDeleted) return res.status(401).json({ message: 'Identity dissolved. Unauthorized access.' });

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
            // email and phone remain static as per tenant security requirements
            if (req.body.profileImage) {
                user.profileImage = req.body.profileImage;
            }

            // Allow staff to update their own specialization/services
            if (user.role === 'Staff') {
                if (req.body.services) {
                    let services = req.body.services;
                    if (typeof services === 'string') {
                        if (services.includes(',')) {
                            services = services.split(',').map(s => s.replace(/[\[\]'"]/g, '').trim());
                        } else {
                            services = [services.replace(/[\[\]'"]/g, '').trim()];
                        }
                    }
                    user.services = Array.isArray(services) ? services.filter(s => s && s.length === 24) : user.services;
                }

                if (req.body.specialization) {
                    let spec = req.body.specialization;
                    if (typeof spec === 'string') spec = spec.split(',').map(s => s.trim());
                    user.specialization = Array.isArray(spec) ? spec : user.specialization;
                }

                if (req.body.bio !== undefined) {
                    user.bio = req.body.bio;
                }
            }
            
            const updatedUser = await user.save();
            const populatedUser = await User.findById(updatedUser._id).populate('services');
            res.json({
                _id: populatedUser._id,
                name: populatedUser.name,
                email: populatedUser.email,
                role: populatedUser.role,
                phone: populatedUser.phone,
                customId: populatedUser.customId,
                profileImage: populatedUser.profileImage,
                services: populatedUser.services,
                specialization: populatedUser.specialization,
                bio: populatedUser.bio,
                leaveBalance: populatedUser.leaveBalance,
                accessToken: generateAccessToken(populatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'Identity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Change Password
// @route PUT /api/auth/change-password
// @access Private
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Identity not found' });

        // If user has a password, verify it. If not (OTP user), allow setting new one directly
        if (user.password) {
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Security credentials synchronized successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Soft Delete User
// @route DELETE /api/auth/profile
// @access Private
const softDeleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Identity not found' });

        user.isDeleted = true;
        user.deletedAt = Date.now();
        await user.save();

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        res.json({ message: 'Identity dissolved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Current User Profile
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('services');
        if (!user) return res.status(404).json({ message: 'Identity not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, refresh, logoutUser, sendOTP, updateUserProfile, changePassword, softDeleteUser, getMe };
