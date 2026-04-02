const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');

// @desc Handle Stripe Webhook
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Sync local order payment status
        const order = await Order.findOne({ paymentIntentId });
        if (order) {
            order.paymentStatus = 'Paid';
            await order.save();
            console.log(`Order ${order.orderId} marked as Paid via Webhook.`);
        }

        // Sync appointment payment status if linked
        const appointment = await Appointment.findOne({ 
            // In a real scenario, we'd store paymentIntentId on Appointment model too
            // Adding it to Appointment.js would be beneficial
            paymentIntentId: paymentIntentId 
        });
        if (appointment) {
            appointment.paymentStatus = 'Paid';
            appointment.status = 'Confirmed';
            await appointment.save();
            console.log(`Appointment ${appointment._id} marked as Paid/Confirmed.`);
        }
    }

    res.json({ received: true });
};

module.exports = { handleStripeWebhook };
