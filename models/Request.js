const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deviceType: { type: String, required: true },
    reason: { String, required: true },
    useCase: { String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed"],
      default: "Pending",
    },
    notes: { String, required: false },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
