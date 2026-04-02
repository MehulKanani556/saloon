const User = require('../models/User');

// @desc Sync local wishlist with DB
const syncWishlist = async (req, res) => {
    try {
        const { wishlistItems } = req.body;
        const user = await User.findById(req.user._id);
        if (user) {
            user.wishlist = wishlistItems.map(item => item._id);
            await user.save();
            res.status(200).json({ message: 'Wishlist synchronized with cloud storage' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Sync failed', error: err.message });
    }
};

// @desc Get user wishlist from DB
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        if (user) {
            res.status(200).json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Wishlist retrieval failed', error: err.message });
    }
};

module.exports = { syncWishlist, getWishlist };
