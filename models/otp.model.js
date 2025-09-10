const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    otpType: { type: String },
    user_email: { type: String },
    user_cell: { type: String },
    otp: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otpSchema);
