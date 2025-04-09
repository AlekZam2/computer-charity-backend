const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: `"Tech for Diversity" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send email. Please try again later.");
  }
};

module.exports = sendEmail;
