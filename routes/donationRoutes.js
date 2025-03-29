const express = require("express");
const sendEmail = require("../services/emailService");
const { processDonation } = require("../services/donationService");
const Donation = require("../models/Donation");
const Device = require("../models/Device");

const router = express.Router();

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
router.get("/donations", async (req, res) => {
  try {
    const donations = await Donation.find().populate("userId");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Create a new donation with devices
 *     description: Creates a donation entry and links donated devices
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               devices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     make:
 *                       type: string
 *                     model:
 *                       type: string
 *                     condition:
 *                       type: string
 *                     assetType:
 *                       type: string
 *                     age:
 *                       type: string
 *     responses:
 *       201:
 *         description: Donation and devices saved successfully
 */
router.post("/donations", async (req, res) => {
  try {
    const { user, donation } = req.body;

    // if ( ! || devices.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ error: "User ID and devices are required!" });
    // }

    // Step 1: Process the donation and devices
    await processDonation(userId, devices);

    // Step 2: Send confirmation email
    const subject = "Donation Confirmation ✅";
    const message = `
      <h3>Dear ${user.firstName},</h3>
      <p>Thank you for donating ${devices.length} device(s)!</p>
      <p>Your generosity is making a difference.</p>
      <p>Best Regards,<br>Computer Charity Team</p>
    `;

    await sendEmail(user.email, subject, message);
    await sendEmail(
      process.env.ADMIN_EMAIL,
      "New Donation Received",
      `User ${user.firstName} made a donation.`
    );

    res
      .status(201)
      .json({ message: "Donation and devices saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
