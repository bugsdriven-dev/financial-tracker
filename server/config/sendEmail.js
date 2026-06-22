const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    try {
        // Create a connection to Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send the email
        await transporter.sendMail({
            from: `"Financial Tracker" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log('Email sent successfully!');
    } catch (error) {
        console.log('Email sending failed:', error.message);
        throw error;
    }
};

module.exports = sendEmail;