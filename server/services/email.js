const { Resend } = require('resend');
const nodemailer = require('nodemailer');

const sendTicketEmail = async (userEmail, event) => {
    const resendKey = process.env.RESEND_API_KEY;

    // --- PRODUCTION: Use Resend API (Bypasses SMTP blocks) ---
    if (resendKey) {
        console.log(`Email Service: Using Resend API for ${userEmail}...`);
        const resend = new Resend(resendKey);

        try {
            const { data, error } = await resend.emails.send({
                from: 'SydEvents <onboarding@resend.dev>', // Free tier default
                to: [userEmail],
                subject: `🎟️ Your Ticket Link: ${event.title}`,
                html: `
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
            });

            if (error) {
                console.error('Resend API Error:', error);
                return false;
            }
            console.log('Email sent via Resend API successfully');
            return true;
        } catch (err) {
            console.error('Resend Exception:', err);
            return false;
        }
    }

    // --- LOCAL DEV: Use SMTP (Allowed on Home Networks) ---
    console.log(`Email Service: Resend key missing, falling back to SMTP for ${userEmail}...`);
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
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
