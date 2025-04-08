const express = require("express");
const sendEmail = require("../services/emailService");
const {
  getAllDonations,
  createDonation,
} = require("../controllers/donationController");

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
router.get("/donations", getAllDonations);
/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Create a donation and add devices
 *     description: Creates a donation entry and adds devices linked to it
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
 *         description: Donation and devices created successfully
 */
router.post("/donations", createDonation);

module.exports = router;
