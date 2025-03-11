const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const donationRoutes = require("./routes/donationRoutes");
const setupSwagger = require("./swaggerConfig");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

connectDB();
setupSwagger(app);
app.use("/api/donations", donationRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Computer Charity API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
