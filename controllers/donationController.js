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

    //Check if the user already exists
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      // Create a new user
      existingUser = await User.create(user);
    }

    // Create a donation entry in the Donation collection
    const donationDoc = await Donation.create({
      donationType: donation.donationType,
      amount: donation.amount || 0,
      status: donation.status || "Pending",
      userId: existingUser._id,
      otherInformation: donation.otherInformation || "",
      devices: [], // initially empty
      amount: donation.donationType === "money" ? donation.amount : 0,
    });

    // Create devices linked to this donation
    const deviceEntries = donation.devices.map((device) => ({
      ...device,
      donationId: donationDoc._id,
    }));
    const savedDevices = await Device.insertMany(deviceEntries);
    const deviceIds = savedDevices.map((device) => device._id);
    // Update the donation with the device IDs
    donationDoc.devices = deviceIds;
    await donationDoc.save();
    // send email to the donor and admin
    await sendConfirmationEmail(
      existingUser.email,
      existingUser.firstName + " " + existingUser.lastName,
      donation.donationType === "money"
        ? `£${donation.amount}`
        : `${donation.devices.length} devices (${donation.devices
            .map((device) => device.deviceType)
            .join(", ")})`
    );

    // Respond with success
    res.status(201).json({
      message: "User, donation, and devices saved successfully!",
      userId: existingUser._id,
      donationId: donationDoc._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllDonations(req, res) {
  try {
    const donations = await Donation.find()
      .populate({
        path: "userId",
        select: "firstName lastName email companyName jobTitle phone address",
      })
      .populate({
        path: "devices",
        select: "deviceType",
      });

    res.status(200).json(donations);
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
