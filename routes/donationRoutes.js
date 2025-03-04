const express = require("express");
const sendEmail = require("../services/emailService");

const router = express.Router();

let donations = [];

router.post("/receive", async (req, res) => {
  const { donorName, donorEmail, amount } = req.body;

  if (!donorName || !donorEmail || !amount) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const donation = { donorName, donorEmail, amount };
  donations.push(donation);

  const subject = "Donation Request Received ✅";
  const message = `
    <h3>Dear ${donorName},</h3>
    <p>Thank you for your generous donation of <strong>$${amount}</strong>.</p>
    <p>We truly appreciate your support in helping those in need!</p>
    <p>Best Regards,<br>Computer Charity Team</p>
  `;

  await sendEmail(donorEmail, subject, message);

  res.status(200).json({
    message: "Donation request received and confirmation email sent!",
  });
});

module.exports = router;
