const authModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTPEMailService = require("../services/sendGrid.service");

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

    let token = await jwt.sign(
      { id: user.id, email: user.email },
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

exports.sendOtp = async (req, res) => {
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

exports.OtpVerify = async (req, res) => {
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
