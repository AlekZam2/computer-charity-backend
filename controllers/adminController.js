const sendEmail = require("../services/emailService");

async function sendMessage(req, res) {
  try {
    const { name, email, message } = req.body;
    await sendEmail(
      process.env.ADMIN_EMAIL,
      "New Message Received",
      `A new message was received from ${name}. <br> Email: ${email}. <br> Message: ${message}`
    );

    const subject = `Hi ${name}, We've Received Your Message!`;
    const emailMessage = `
    <h3>Dear ${name},</h3>
  <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
  <p>If your inquiry is urgent, feel free to contact us directly.</p>
   <p>Best Regards,<br>'Tech for Diversity' Team</p>
     
    `;
    await sendEmail(email, subject, emailMessage);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  sendMessage,
};
