require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail
        pass: process.env.GMAIL_PASS  // App Password
    }
});

app.post('/send-email', async (req, res) => {
    const { senderEmail, recipients, message } = req.body;

    if (!senderEmail || !recipients || recipients.length === 0 || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const mailOptions = {
        from: senderEmail,
        to: recipients.join(','), // Join emails into a single string
        subject: "New Message",
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: "Emails sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
