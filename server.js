const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elixirdevelopmentbot@gmail.com', // Replace with your Gmail address
    pass: 'hhsm xrqj wmip svhx' // Use an App Password if 2FA is enabled
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter configuration error:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields (Name, Email, Message) are required' });
  }

  // Recipient email options
  const recipientMailOptions = {
    from: 'DaisuKie <',
    to: 'elixirdevelopmentbot@gmail.com', // Replace with your recipient email
    subject: `New Contact Request from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Submission</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Dear DaisuKie Dev,<br><br>
          You have received a new contact request from the following individual:
        </p>
        <ul style="list-style-type: none; padding-left: 0; color: #555; font-size: 16px;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></li>
          <li><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</li>
        </ul>
        <p style="color: #555; font-size: 16px; text-align: center; margin-top: 20px;">
          This message was submitted on ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}.
        </p>
        <p style="color: #555; font-size: 14px; text-align: center; margin-top: 20px;">
          Regards,<br>DaisuKie Dev<br><a href="https://daisukie.is-a.dev/" style="color: #007bff; text-decoration: none;">https://daisukie.is-a.dev/</a>
        </p>
      </div>
    `
  };

  // User confirmation email options
  const userMailOptions = {
    from: 'DaisuKie <',
    to: email,
    subject: 'Message Submission Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Message Confirmation</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Dear ${name},<br><br>
          Thank you for reaching out! Your message has been successfully sent to our team. We will review it and get back to you as soon as possible.
        </p>
        <p style="color: #555; font-size: 16px; text-align: center; margin-top: 20px;">
          Submission Date: ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}.
        </p>
        <p style="color: #555; font-size: 14px; text-align: center; margin-top: 20px;">
          Best regards,<br>DaisuKie Dev<br><a href="https://daisukie.is-a.dev/" style="color: #007bff; text-decoration: none;">https://daisukie.is-a.dev/</a>
        </p>
      </div>
    `
  };

  try {
    // Send email to recipient
    await transporter.sendMail(recipientMailOptions);
    // Send confirmation email to user
    await transporter.sendMail(userMailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.responseCode === 535 || error.code === 'EAUTH') {
      res.status(500).json({ message: 'Authentication failed. Please ensure the App Password is correct and 2FA is properly configured for Gmail.' });
    } else {
      res.status(500).json({ message: 'Failed to send email. Please try again later.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
