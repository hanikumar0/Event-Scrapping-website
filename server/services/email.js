const axios = require('axios');
const nodemailer = require('nodemailer');

const sendTicketEmail = async (userEmail, event) => {
    const brevoKey = process.env.BREVO_API_KEY;

    // --- PRODUCTION: Use Brevo API (HTTP 443 - Bypasses SMTP blocks) ---
    if (brevoKey) {
        console.log(`Email Service: Using Brevo API for ${userEmail}...`);

        try {
            const response = await axios({
                method: 'post',
                url: 'https://api.brevo.com/v3/smtp/email',
                headers: {
                    'accept': 'application/json',
                    'api-key': brevoKey,
                    'content-type': 'application/json'
                },
                data: {
                    sender: { name: "SydEvents", email: "hanikumar064@gmail.com" },
                    to: [{ email: userEmail }],
                    subject: `🎟️ Your Ticket Link: ${event.title}`,
                    htmlContent: `
                        <div style="font-family: sans-serif; padding: 20px; color: #1f2937;">
                            <h1 style="color: #6366f1;">Your Ticket is Ready!</h1>
                            <p>Hello,</p>
                            <p>You requested a ticket link for the following event:</p>
                            <div style="padding: 15px; background: #f3f4f6; border-radius: 10px; margin: 20px 0;">
                                <h2 style="margin: 0;">${event.title}</h2>
                                <p style="color: #64748b;">Venue: ${event.venueName || 'Sydney'}</p>
                            </div>
                            <p>Click the button below to complete your booking:</p>
                            <a href="${event.originalUrl}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">GET TICKETS NOW</a>
                        </div>
                    `
                }
            });

            console.log('Email sent via Brevo API successfully');
            return true;
        } catch (err) {
            console.error('Brevo API Error:', err.response?.data || err.message);
            return false;
        }
    }

    // --- LOCAL DEV: Use SMTP (Allowed on Home Networks) ---
    console.log(`Email Service: Brevo key missing, falling back to SMTP for ${userEmail}...`);
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Standard STARTTLS port
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    try {
        await transporter.sendMail({
            from: `"SydEvents" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `🎟️ Your Ticket Link: ${event.title}`,
            html: `<p>Ticket link for <b>${event.title}</b>: <a href="${event.originalUrl}">Click here</a></p>`
        });
        console.log(`SMTP Email sent successfully to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('SMTP sending failed:', error);
        return false;
    }
};

module.exports = { sendTicketEmail };
