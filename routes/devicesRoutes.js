const express = require("express");
const router = express.Router();
const {
  getAllDevices,
  updateDevice,
} = require("../controllers/devicesController");
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Get all devices with related donation and user details
 *     description: Fetch all devices along with donation details and user information.
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of devices with donation and user details
 *       401:
 *         description: Unauthorized, token required
 *       500:
 *         description: Internal Server Error
 */
router.get("/", authMiddleware, getAllDevices);

/**
 * @swagger
 * /devices/{id}:
 *   put:
 *     summary: Update a device
 *     description: Update device details by ID.
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device:
 *                 type: object
 *                 description: Device update fields
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       404:
 *         description: Device not found
 *       401:
 *         description: Unauthorized, token required
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", authMiddleware, updateDevice);

module.exports = router;
