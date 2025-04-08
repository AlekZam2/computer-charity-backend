const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    deviceType: { type: String, required: true },
    make: String,
    model: String,
    age: String,
    condition: String,
    otherInformation: String,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined", "Received"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", DeviceSchema);

module.exports = Device;
