const Setting = require('../models/Setting');

// @desc Get Salon Settings
const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            // Default settings for first-time use
            settings = await Setting.create({
                businessHours: [
                    { day: 'Monday - Friday', open: '09:00', close: '20:00' },
                    { day: 'Saturday', open: '09:00', close: '18:00' },
                    { day: 'Sunday', open: '00:00', close: '00:00', isOpen: false }
                ],
                paymentMethods: [
                    { name: 'UPI / GPay / PhonePe' },
                    { name: 'Cash on Venue' }
                ]
            });
        } 
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: 'Settings retrieval failed', error: err.message });
    }
};

// @desc Update Salon Settings
const updateSettings = async (req, res) => {
    try {
        const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: 'Settings update failed', error: err.message });
    }
};

module.exports = { getSettings, updateSettings };
