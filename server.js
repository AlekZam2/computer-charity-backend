const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const setupSwagger = require("./swaggerConfig");
const donationRoutes = require("./routes/donationRoutes");
const authRoutes = require("./routes/authRoutes");
const devicesRoutes = require("./routes/devicesRoutes");
const adminRoutes = require("./routes/adminRoutes");
const requestsRoutes = require("./routes/requestsRoutes");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

connectDB();
setupSwagger(app);
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/requests", requestsRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Computer Charity API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
