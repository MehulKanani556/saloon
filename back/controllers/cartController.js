const User = require('../models/User');

// @desc Sync local cart with DB
const syncCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const user = await User.findById(req.user._id);
        if (user) {
            user.cart = cartItems.map(item => ({
                product: item._id,
                quantity: item.qty
            }));
            await user.save();
            res.status(200).json({ message: 'Cart synchronized with cloud storage' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Sync failed', error: err.message });
    }
};

// @desc Get user cart from DB
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        if (user) {
            const formattedCart = user.cart.map(item => ({
                ...item.product._doc,
                qty: item.quantity
            }));
            res.status(200).json(formattedCart);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Cart retrieval failed', error: err.message });
    }
};

module.exports = { syncCart, getCart };
