const express = require("express");
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  updateRequest,
  deleteRequest,
} = require("../controllers/requestsController");
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new device request
 *     description: Creates a new user (if not existing) and a corresponding device request.
 *     tags: [Requests]
 *     requestBody:
 *
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 description: User details
 *               request:
 *                 type: object
 *                 description: Request details
 *     responses:
 *       201:
 *         description: Request created successfully
 *       400:
 *         description: Bad request (missing user/request)
 *       500:
 *         description: Internal Server Error
 */
router.post("/", createRequest);

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests
 *     description: Fetch all device requests with user details
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of device requests
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get("/", authMiddleware, getAllRequests);

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Update a request
 *     description: Update request details by ID
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Request updated successfully
 *       404:
 *         description: Request not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", authMiddleware, updateRequest);

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete a request
 *     description: Delete a request by ID
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", authMiddleware, deleteRequest);

module.exports = router;
