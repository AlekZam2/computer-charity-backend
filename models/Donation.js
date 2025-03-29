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
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined", "Received"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", DonationSchema);
module.exports = Donation;
