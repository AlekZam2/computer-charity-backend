const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donationType: {
      type: String,
      enum: ["device", "money"],
      required: true,
    },
    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined", "Received"],
      default: "Pending",
    },
    otherInformation: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", DonationSchema);
module.exports = Donation;
