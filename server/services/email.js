const nodemailer = require('nodemailer');

const sendTicketEmail = async (userEmail, event) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials missing (EMAIL_USER or EMAIL_PASS)');
    }

    console.log(`Email Service: Preparing to send to ${userEmail}...`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000,
        debug: true,
        logger: true
    });

    const mailOptions = {
        from: `"SydEvents" <${process.env.EMAIL_USER}>`,
        to: userEmail,
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
                <p style="margin-top: 30px; font-size: 0.8rem; color: #94a3b8;">
                    Thank you for using SydEvents. 
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

module.exports = { sendTicketEmail };
