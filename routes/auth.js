const express = require("express");
const { check } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user, allowing them to provide basic info such as first name, last name, phone number, email, and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *               phone:
 *                 type: string
 *                 description: The user's phone number
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password (optional, but required for certain roles)
 *               companyName:
 *                 type: string
 *                 description: The user's company name (optional, but required for corposate donors)
 *               jobTitle:
 *                 type: string
 *                 description: The user's job title (optional, but required for corposate donors)
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *               - email
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
// Register route
router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("phone", "Phone number is required").not().isEmpty(),
    check("email", "Please provide a valid email").isEmail(),
    check("password")
      .optional()
      .isLength({ min: 4 })
      .withMessage("Password must be 4 or more characters"),
  ],
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: This endpoint allows a user to log in with their email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

// Login route
router.post(
  "/login",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

module.exports = router;
