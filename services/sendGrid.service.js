const sgMail = require("@sendgrid/mail");
const OtpModel = require("../models/otp.model");
const sendgrid = process.env.SENDGRID;


sgMail.setApiKey(
  `${sendgrid}`
);

exports.sendOtp = async (email) => {
  try {
    console.log(`Sending OTP to ${email}`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP: ${otp}`);

    const msg = {
      to: email,
      from: "notifications@suresend.africa", // make sure this is verified in SendGrid
      templateId: "d-1c71b0144197473795999bc85e629dd6", // must be dynamic + published
      dynamic_template_data: {
        code: otp, // must match {{code}} in the template
      },
    };

    await OtpModel.create({
      otpType: "Email",
      user_email: email,
      otp: otp,
    });

    const [response] = await sgMail.send(msg);
    console.log("SendGrid response status code:", response.statusCode);

    return { success: true, message: "OTP Sent" };
  } catch (e) {
    console.error("Error sending OTP", e.response?.body || e.message);
    throw new Error("Error sending OTP");
  }
};

exports.verifyOtp = async (email, otp) => {
  try {
    const latestUser = await OtpModel.findOne({
      user_email: email,
      otpType: "Email",
      status: true,
    })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec();

    if (!latestUser) {
      return { success: false, message: "No OTP found for this email" };
    }

    // Compare entered OTP with the stored OTP
    if (latestUser.otp === otp) {
      await OtpModel.findOneAndUpdate(
        { user_email: email, status: true },
        { $set: { status: false } },
        { new: true }
      );
      return { success: true, message: "OTP is valid" };
    } else {
      return { success: false, message: "Invalid OTP" };
    }
  } catch (e) {
    console.error("Error verifying OTP", e);
    throw new Error("Error verifying OTP");
  }
};
