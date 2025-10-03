const authModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTPEMailService = require("../services/sendGrid.service");
const OTPMobileService = require("../services/otp.service");
const { verifyOtp } = require("../services/otp.service");

exports.createUser = async (req, res) => {
  try {
    let {
      first_name,
      middle_name,
      last_name,
      dob,
      country_of_residence,
      secret_pin,
      password,
      email,
      cell,
      address,
    } = req.body;

    const oldUser = await authModel.checkExisitingUser(email);
    const oldUserMobile = await authModel.checkExisitingUserMobile(cell);

    if (oldUser) {
      return res.status(400).json({
        success: false,
        data: "User Email already exists",
      });
    }

    if (oldUserMobile) {
      return res.status(400).json({
        success: false,
        data: "User Phone already exists",
      });
    }

    let encryptionPassword = await bcrypt.hash(password, 10);
    console.log(encryptionPassword);
    let UserData = {
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      dob: dob,
      country_of_residence: country_of_residence,
      secret_pin: secret_pin,
      password: encryptionPassword,
      email: email,
      cell: cell,
      address: address,
    };

    const userResponse = await authModel.createUser(UserData);

    const user = await authModel.findOneEmail(email);

    let token = await jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY
    );

    console.log(token);

    let objWithToken = { user, token };

    res.status(201).json({
      success: true,
      data: objWithToken,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    const user = await authModel.checkExisitingUser(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        data: "User does not exist",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        data: "Invalid password",
      });
    }

    // let token = await jwt.sign(
    //   { id: user.id, email: user.email },
    //   process.env.JWT_SECRET_KEY
    // );

    let token = await jwt.sign(
      { userId: user.person_id, email: user.email },
      process.env.JWT_SECRET_KEY
    );

    res.status(200).json({
      success: true,
      data: user,
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.sendOtpEmail = async (req, res) => {
  try {
    let email = req.body.email;
    const otpResponse = await OTPEMailService.sendOtp(email);

    console.log(otpResponse);

    res.status(200).json({
      success: true,
      data: otpResponse.message,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let email = req.body.email;
    const otpResponse = await OTPEMailService.sendOtp(email);
    res.status(200).json({
      success: true,
      data: otpResponse.message,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.verifyForgotPassword = async (req, res) => {
  try {
    let { email, otp } = req.body;
    console.log("Request:", { email, otp });

    // 1. Verify OTP
    const otpResponse = await OTPEMailService.verifyOtp(email, otp);
    if (!otpResponse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    // 2. successful response
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("Request:", { email, password });

    // // 1. Verify OTP
    // const otpResponse = await OTPEMailService.verifyOtp(email, otp);
    // if (!otpResponse.success) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid OTP",
    //   });
    // }

    // 2. Find user
    const user = await authModel.findOneEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Encrypt password
    const encryptionPassword = await bcrypt.hash(password, 10);
    console.log("Encrypted Password:", encryptionPassword);

    // 4. Update password
    await authModel.updatePassword(user.person_id, encryptionPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("resetPassword Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.sendOtpMobile = async (req, res) => {
  try {
    let cell = req.body.cell;
    const otpResponse = await OTPMobileService.sendOtp(cell);

    res.status(200).json({
      success: true,
      data: otpResponse.message,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.OtpVerifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Verify OTP
    const otpResponse = await OTPEMailService.verifyOtp(email, otp);

    if (!otpResponse.success) {
      return res.status(400).json({
        success: false,
        data: "Invalid OTP",
      });
    }

    // 2. Fetch the user (so you can issue JWT with userId/email just like normal login)
    const user = await authModel.checkExisitingUser(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        data: "User does not exist",
      });
    }

    // 3. Issue JWT (same as your password login)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" } // optional
    );

    res.status(200).json({
      success: true,
      message: "OTP Verified",
      data: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.loginPhoneVerify = async (req, res) => {
  try {
    let { PhoneNumber, otp } = req.body;

    const otpResponse = await OTPMobileService.verifyOtp(PhoneNumber, otp);

    if (!otpResponse.success) {
      return res.status(400).json({
        success: false,
        data: "Invalid OTP",
      });
    }

    // 2. Fetch the user (so you can issue JWT with userId/email just like normal login)
    const user = await authModel.checkExisitingUser(PhoneNumber);

    if (!user) {
      return res.status(400).json({
        success: false,
        data: "User does not exist",
      });
    }

    // 3. Issue JWT (same as your password login)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" } // optional
    );

    res.status(200).json({
      success: true,
      message: "OTP Verified",
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res
        .status(400)
        .json({ success: false, error: "Identifier required" });
    }

    // Detect type
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\+[1-9]\d{7,14}$/.test(identifier);

    if (!isEmail && !isPhone) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or phone number" });
    }

    // Send OTP
    if (isEmail) {
      await OTPEMailService.sendOtp(identifier);
    } else {
      await OTPMobileService.sendOtp(identifier);
    }

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res
        .status(400)
        .json({ success: false, error: "Identifier and OTP required" });
    }

    // Detect type
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^[0-9]{7,15}$/.test(identifier);

    if (!isEmail && !isPhone) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or phone number" });
    }

    // Verify OTP
    if (isEmail) {
      const otpResponse = await OTPEMailService.verifyOtp(identifier, otp);
      return res.status(200).json({ success: true, data: otpResponse });
    } else {
      const otpResponse = await OTPMobileService.verifyOtp(identifier, otp);
      return res.status(200).json({ success: true, data: otpResponse });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateFcmToken = async (req, res) => {
  try {
    const { person_id } = req.params;
    const { fcm_token } = req.body;

    if (!fcm_token) {
      return res.status(400).json({
        status: false,
        message: "FCM token is required",
      });
    }

    const updatedPerson = await authModel.updateFcmToken(person_id, fcm_token);

    if (!updatedPerson) {
      return res.status(404).json({
        status: false,
        message: "Person not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "FCM token updated successfully",
      data: updatedPerson,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await authModel.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users details received successfully",
      data: users,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.createDeleteReason = async (req, res) => {
  const { userId } = req.user; 
  const { reason } = req.body;

  if (!reason)
    return res.status(400).json({ success: false, message: "Reason required" });

  try {
    const deleteReason = await authModel.createDeleteReason(userId, reason);
    return res.json({ success: true, deleteRequestId: deleteReason.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verifyDeleteRequest = async (req, res) => {
  const { userId } = req.user;
  const { deleteRequestId, password, pin, otp, phone } = req.body;

  if (!deleteRequestId) {
    return res.status(400).json({ success: false, message: "deleteRequestId required" });
  }

  try {
    const user = await authModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let isVerified = false;

    if (password) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) isVerified = true;
    } else if (pin && pin === user.secret_pin) {
      isVerified = true;
    } else if (otp && phone) {
      const otpResult = await verifyOtp(phone, otp);
      if (otpResult.success) isVerified = true;
    }

    if (!isVerified) {
      return res.status(401).json({ success: false, message: "Verification failed" });
    }

    await authModel.verifyDeleteRequest(deleteRequestId, userId);

    return res.json({ success: true, message: "Verification successful" });
  } catch (err) {
    console.error("Error in verifyDeleteRequest:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.confirmDeleteAccount = async (req, res) => {
  const { userId } = req.user;
  const { deleteRequestId } = req.body;

  if (!deleteRequestId)
    return res.status(400).json({ success: false, message: "deleteRequestId required" });

  try {
    const verifiedRequest = await authModel.getVerifiedDeleteRequest(deleteRequestId, userId);
    if (!verifiedRequest)
      return res.status(400).json({ success: false, message: "Not verified yet" });

    await authModel.deleteUser(userId);
    await authModel.completeDeleteRequest(deleteRequestId);

    return res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error in confirmDeleteAccount:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};