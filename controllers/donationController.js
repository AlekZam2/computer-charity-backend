const Donation = require("../models/Donation");
const Device = require("../models/Device");

async function createDonation(req, res) {
  try {
    const { userId, devices } = req.body;

    if (!userId || !devices || devices.length === 0) {
      return res
        .status(400)
        .json({ error: "User ID and devices are required!" });
    }

    // Step 1: Create a donation entry in the Donation collection
    const donation = await Donation.create({ userId });

    // Step 2: Create devices linked to this donation
    const deviceEntries = devices.map((device) => ({
      ...device,
      donationId: donation._id,
    }));
    await Device.insertMany(deviceEntries);

    // Step 3: Respond with success
    res.status(201).json({
      message: "Donation and devices saved successfully!",
      donationId: donation._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createDonation };
