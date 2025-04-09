const Donation = require("../models/Donation");
const Device = require("../models/Device");
const User = require("../models/User");
const sendEmail = require("../services/emailService");

async function sendConfirmationEmail(donorEmail, donorName, donationDetails) {
  const subject = "Donation Request Received ✅";
  const message = `
    <h3>Dear ${donorName},</h3>
    <p>Thank you for your generous donation of <strong>${donationDetails}</strong>.</p>
    <p>We truly appreciate your support in helping those in need!</p>
    <p>Best Regards,<br>'Tech for Diversity' Team</p>
  `;
  await sendEmail(donorEmail, subject, message);
  await sendEmail(
    process.env.ADMIN_EMAIL,
    "New Donation Received",
    `A new donation was received from ${donorName}. Details: ${donationDetails}`
  );
}
async function createDonation(req, res) {
  try {
    const { user, donation } = req.body;

    if (!user || donation.devices.length === 0) {
      return res
        .status(400)
        .json({ error: "User details and devices are required!" });
    }

    // Step 1: Check if the user already exists
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      // Step 2: Create a new user
      existingUser = await User.create(user);
    }

    // Step 3: Create a donation entry in the Donation collection
    const donationId = await Donation.create({
      ...donation,
      userId: existingUser._id,
    });

    // Step 4: Create devices linked to this donation
    const deviceEntries = donation.devices.map((device) => ({
      ...device,
      donationId: donation._id,
    }));
    await Device.insertMany(deviceEntries);
    await sendConfirmationEmail(
      existingUser.email,
      existingUser.firstName + " " + existingUser.lastName,
      donation.donationType === "money"
        ? `£${donation.amount}`
        : `${donation.devices.length} devices (${donation.devices
            .map((device) => device.deviceType)
            .join(", ")})`
    );

    // Step 5: Respond with success
    res.status(201).json({
      message: "User, donation, and devices saved successfully!",
      userId: existingUser._id,
      donationId: donationId._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllDonations(req, res) {
  try {
    const devicesWithDonation = await Device.find().populate({
      path: "donationId",
      select: "donationType userId",
      populate: {
        path: "userId",
        select: "firstName lastName email companyName jobTitle phone address",
      },
    });

    res.status(200).json(devicesWithDonation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getDonationById(req, res) {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id).populate("devices");
    if (!donation) {
      return res.status(404).json({ error: "Donation not found!" });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function updateDonation(req, res) {
  try {
    const { id } = req.params;
    const { userId, devices } = req.body;

    if (!userId || !devices || devices.length === 0) {
      return res
        .status(400)
        .json({ error: "User ID and devices are required!" });
    }

    const donation = await Donation.findByIdAndUpdate(
      id,
      { userId },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: "Donation not found!" });
    }

    await Device.deleteMany({ donationId: id });

    const deviceEntries = devices.map((device) => ({
      ...device,
      donationId: donation._id,
    }));
    await Device.insertMany(deviceEntries);

    res.status(200).json({
      message: "Donation and devices updated successfully!",
      donationId: donation._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
};
