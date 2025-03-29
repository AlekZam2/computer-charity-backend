const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: function () {
        return this.requiresPassword;
      },
    },
    companyName: { type: String, default: null },
    jobTitle: { type: String, default: null },
    role: {
      type: String,
      enum: ["admin", "donor", "requester"],
      default: "donor",
    },
    requiresPassword: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
