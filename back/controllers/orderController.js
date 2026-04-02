const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Create a new order after checkout
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentIntentId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items provided for acquisition' });
        }

        // 1. Verify and Update Inventory Stock Protocol
        const productUpdates = [];
        for (const item of items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ message: `Inventory component ${item.name} not found in the matrix.` });
            }
            if (product.stock < item.qty) {
                return res.status(400).json({ message: `Insufficient inventory for ${product.name}. Remaining: ${product.stock}` });
            }
            product.stock -= item.qty;
            productUpdates.push(product.save());
        }

        // Parallel execution of inventory sync
        await Promise.all(productUpdates);

        const order = new Order({
            user: req.user._id,
            items: items.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                qty: item.qty
            })),
            totalAmount,
            shippingAddress,
            paymentIntentId,
            paymentStatus: paymentIntentId ? 'Paid' : 'Pending' 
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (err) {
        console.error('ORDER_CREATION_ERR:', err);
        res.status(500).json({ message: 'Order protocol failed: ' + err.message });
    }
};

// @desc Cancel order by User
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

        if (!order) {
            return res.status(404).json({ message: 'Order protocol not found or unauthorized' });
        }

        if (order.status !== 'Processing') {
            return res.status(400).json({ message: 'Only processing orders can be cancelled' });
        }

        // Restock items
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
        }

        order.status = 'Cancelled';
        await order.save();
        res.status(200).json({ message: 'Acquisition cancelled successfully', order });
    } catch (err) {
        res.status(500).json({ message: 'Cancellation failed', error: err.message });
    }
};

// @desc Get all orders for the Admin Ledger
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Ledger retrieval failed', error: err.message });
    }
};

// @desc Update order status (Processing, Shipped, etc.)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found in matrix' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Status update failed', error: err.message });
    }
};

// @desc Get current user's orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'My Orders retrieval failed', error: err.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    getMyOrders,
    cancelOrder
};
