const express = require("express");
const sendEmail = require("../services/emailService");

const router = express.Router();

let donations = [];
/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Get all donations
 *     description: Retrieve a list of all donations
 *     responses:
 *       200:
 *         description: A list of donations.
 */
router.get("/donations", (req, res) => {
  res.json([{ id: 1, donor: "John Doe", amount: 100 }]);
});
/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Create a new donation
 *     description: Add a new donation entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donor:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Donation successfully created
 */
router.post("/donations", async (req, res) => {
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

  await sendEmail(
    process.env.ADMIN_EMAIL,
    "New Donation Received",
    `A new donation was received from ${donorName}. Details: ${donationDetails}`
  );

  res.status(200).json({
    message: "Donation request received and confirmation email sent!",
  });
});

module.exports = router;
