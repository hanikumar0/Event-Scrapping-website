require('dotenv').config();
const { sendTicketEmail } = require('./services/email');

const testEmail = async () => {
    console.log('Testing email send to:', process.env.EMAIL_USER);
    const mockEvent = {
        title: 'Test Event',
        venueName: 'Test Venue',
        originalUrl: 'https://example.com'
    };

    try {
        const result = await sendTicketEmail(process.env.EMAIL_USER, mockEvent);
        console.log('Final Result:', result ? 'SUCCESS' : 'FAILURE');
    } catch (err) {
        console.error('Test Error:', err);
    }
};

testEmail();
