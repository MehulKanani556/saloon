const stripe = require('stripe')(process.env.STRIPE_SECRET);

const createPaymentIntent = async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET) {
            return res.status(500).json({ message: 'Stripe secret key is missing' });
        }
        
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        res.status(500).json({ message: 'Payment Intent creation failed', error: err.message });
    }
};

module.exports = {
    createPaymentIntent
};
