require("dotenv").config();
const twilio = require("twilio");
const OtpModel = require("../models/otp.model");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

exports.sendOtp = async (phone) => {
  try {
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    let otp_status = await client.messages.create({
      body: `Your OTP is feeding Bird ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    await OtpModel.create({
      otpType: "Cell",
      user_cell: phone,
      otp: otp,
    });

    return otp_status;
  } catch (error) {
    console.log(error);
  }
};

exports.verifyOtp = async (phone, otp) => {
  try {
    const latestUser = await OtpModel.findOne({
      user_cell: phone,
      status: true,
      otpType: "Cell",
    });

    if (!latestUser) {
      return { success: false, message: "No OTP found for this email" };
    }

    if (latestUser.otp === otp) {
      await OtpModel.findOneAndUpdate(
        { user_cell: phone, status: true },
        { $set: { status: false } },
        { new: true }
      );
      return { success: true, message: "OTP is valid" };
    } else {
      return { success: false, message: "Invalid OTP" };
    }
  } catch (error) {
    console.log(error);
  }
};
