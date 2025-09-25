const express = require("express");
const router = express.Router();
const Auth = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

router.post("/create", Auth.createUser);
router.post("/login", Auth.loginUser);

router.post("/sendVeficationOTP", Auth.sendOtp);
router.post("/VerifyOTPVerification", Auth.verifyOtp);

router.post("/sendOtpEmail", Auth.sendOtpEmail);
router.post("/loginOtpVerifyEmail", Auth.OtpVerifyEmail);

router.post("/sendOtpMobile", Auth.sendOtpMobile);
router.post("/loginOtpVerifyMobile", Auth.loginPhoneVerify);

router.post("/forgotPassword", Auth.forgotPassword);
router.post("/resetPassword", Auth.resetPassword);

module.exports = router;
