const Device = require("../models/Device");

async function getAllDevices(req, res) {
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

async function updateDevice(req, res) {
  try {
    const { id } = req.params;
    const { device } = req.body;

    const updatedDevice = await Device.findByIdAndUpdate(
      id,
      { $set: device },
      { new: true }
    );
    if (!updatedDevice) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.status(200).json({
      message: "Device updated successfully!",
      device: updatedDevice,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllDevices,
  updateDevice,
};
