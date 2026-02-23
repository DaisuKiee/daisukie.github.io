require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email service (e.g., 'outlook', 'yahoo')
    auth: {
        user: process.env.EMAIL_USER, // e.g., yourgmail@gmail.com
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

// Email Sending Endpoint
app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Email to Portfolio Owner (Admin Notification)
    const adminMailOptions = {
        from: `"Daisukie Dev" <${process.env.EMAIL_USER}>`,
        to: 'daisukiedev@email.com', 
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Message</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a0000; color: #fff; line-height: 1.6;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a0000 0%, #4a0000 100%); border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background: #ff0000; color: #fff;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">New Message Received</h1>
                            <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">From your Portfolio Contact Form</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #ff3333; margin-bottom: 20px; font-size: 20px; border-bottom: 2px solid #ff3333; padding-bottom: 10px;">Message Details</h2>
                            
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 51, 51, 0.2);">
                                        <strong style="color: #ff3333;">Sender Name:</strong>
                                        <span style="color: #ccc; margin-left: 10px;">${name}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 51, 51, 0.2);">
                                        <strong style="color: #ff3333;">Email Address:</strong>
                                        <span style="color: #ccc; margin-left: 10px;"><a href="mailto:${email}" style="color: #ff6666; text-decoration: none;">${email}</a></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255, 51, 51, 0.2);">
                                        <strong style="color: #ff3333;">Subject:</strong>
                                        <span style="color: #ccc; margin-left: 10px;">${subject}</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="background: rgba(255, 51, 51, 0.05); padding: 20px; border-left: 4px solid #ff3333; border-radius: 5px;">
                                <strong style="color: #ff3333; display: block; margin-bottom: 10px;">Message:</strong>
                                <p style="margin: 0; color: #ccc; white-space: pre-wrap;">${message}</p>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background: rgba(255, 0, 0, 0.1); border-top: 1px solid rgba(255, 51, 51, 0.2);">
                            <p style="margin: 0; font-size: 12px; color: #999;">
                                This email was sent on ${new Date().toLocaleString()}. 
                                <br>built with ❤️ by Daisukie Dev
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    // Confirmation Email to Submitter
    const confirmationMailOptions = {
        from: `"Daisukie Dev" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thank You for Your Message - ${subject}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank You for Contacting Us</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a0000; color: #fff; line-height: 1.6;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a0000 0%, #4a0000 100%); border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background: #ff0000; color: #fff;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Thank You!</h1>
                            <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Your message has been received</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #ff3333; margin-bottom: 20px; font-size: 20px; border-bottom: 2px solid #ff3333; padding-bottom: 10px;">Hi ${name},</h2>
                            
                            <p style="color: #ccc; margin-bottom: 20px;">
                                Thank you for reaching out! I've received your message about "${subject}" and appreciate you taking the time to contact me.
                            </p>
                            
                            <p style="color: #ccc; margin-bottom: 20px;">
                                I'll review it shortly and get back to you as soon as possible. In the meantime, feel free to explore more of my work.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="color: #ff6666; font-size: 16px; font-weight: 600;">Looking forward to collaborating!</p>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background: rgba(255, 0, 0, 0.1); border-top: 1px solid rgba(255, 51, 51, 0.2);">
                            <p style="margin: 0; font-size: 12px; color: #999;">
                                Sent on ${new Date().toLocaleString()}. 
                                <br>If this was a mistake, reply to this email.
                                <br>built with ❤️ by Daisukie Dev
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    // Send both emails
    transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
        if (adminError) {
            console.error('Admin Email Error:', adminError);
            // Still send confirmation even if admin email fails
            transporter.sendMail(confirmationMailOptions, (confirmError, confirmInfo) => {
                if (confirmError) {
                    console.error('Confirmation Email Error:', confirmError);
                    return res.status(500).json({ error: 'Failed to send emails. Please try again.' });
                }
                console.log('Confirmation Email Sent:', confirmInfo.response);
                res.json({ message: 'Confirmation email sent, but admin notification failed. Please follow up manually.' });
            });
        } else {
            console.log('Admin Email Sent Successfully:', adminInfo.response);
            transporter.sendMail(confirmationMailOptions, (confirmError, confirmInfo) => {
                if (confirmError) {
                    console.error('Confirmation Email Error:', confirmError);
                    return res.status(500).json({ error: 'Admin notified, but confirmation failed. Please check your email.' });
                }
                console.log('Confirmation Email Sent:', confirmInfo.response);
                res.json({ message: 'Email sent successfully! I\'ll get back to you soon.' });
            });
        }
    });
});

// Serve Frontend (index.html) as root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend served from 'public' folder. API at /send-email.`);
});