const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Nodemailer Transporter
const transporter = (process.env.EMAIL_USER && process.env.EMAIL_PASS) ? nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}) : null;

if (!transporter) console.warn('⚠️ NODEMAILER: Email service not configured. Email OTP delivery will be disabled.');

// Twilio Client
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) ? twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
) : null;

if (!twilioClient) console.warn('⚠️ TWILIO: SMS service not configured. SMS OTP delivery will be disabled.');

/**
 * Send OTP via Email
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit code
 */
const sendEmailOTP = async (email, otp) => {
    if (!transporter) {
        console.warn(`[DEVELOPMENT] Email for ${email} skipped. OTP: ${otp}`);
        return true;
    }
    try {
        await transporter.sendMail({
            from: `"Glow & Elegance" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Verification Portal Access Code",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background-color: #f9fafb; border-radius: 16px; max-width: 600px; margin: 20px auto; border: 1px solid #e5e7eb;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.025em;">GLOW & ELEGANCE</h1>
                        <p style="color: #6b7280; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">Unified Access Portal</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #374151; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Security Verification</h2>
                        <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">Use the following code to complete your authentication protocol. This code is valid for 10 minutes.</p>
                        
                        <div style="background: linear-gradient(to right, #6366f1, #ec4899); padding: 2px; border-radius: 8px;">
                            <div style="background-color: #ffffff; padding: 16px; border-radius: 6px; text-align: center;">
                                <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #111827;">${otp}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });
        console.log(`Email OTP relay successful to: ${email}`);
        return true;
    } catch (error) {
        console.error('Email Relay Error:', error);
        throw new Error('Failed to deliver email verification code.');
    }
};

/**
 * Send OTP via SMS
 * @param {string} phone - Recipient phone number (format: +XX XXXXXXXXXX)
 * @param {string} otp - 6-digit code
 */
const sendSMSOTP = async (phone, otp) => {
    if (!twilioClient) {
        console.warn(`[DEVELOPMENT] SMS for ${phone} skipped. OTP: ${otp}`);
        return true;
    }
    try {
        await twilioClient.messages.create({
            body: `GLOW & ELEGANCE: Your verification code is ${otp}. Valid for 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        console.log(`SMS OTP relay successful to: ${phone}`);
        return true;
    } catch (error) {
        console.error('SMS Relay Error:', error);
        throw new Error('Failed to deliver SMS verification code.');
    }
};

module.exports = { sendEmailOTP, sendSMSOTP };
