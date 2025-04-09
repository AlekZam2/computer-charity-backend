const express = require("express");
const { check } = require("express-validator");
const { sendMessage } = require("../controllers/adminController");

const router = express.Router();

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Send a message via contact form
 *     description: Allows users to send a message through the contact form.
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The sender's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The sender's email address
 *               message:
 *                 type: string
 *                 description: The message content
 *             required:
 *               - name
 *               - email
 *               - message
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error (missing or invalid fields)
 *       500:
 *         description: Server error
 */

router.post(
  "/message",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("name", "Name is required").notEmpty(),
    check("message", "Message cannot be empty").notEmpty(),
  ],
  sendMessage
);

module.exports = router;
