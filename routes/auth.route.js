const express = require("express");
const router = express.Router();
const Auth = require("../controllers/auth.controller");
//const authMiddleware = require("../middleware/auth");
const {verifyToken} = require("../middleware/auth");


router.post("/create", Auth.createUser);
router.post("/login", Auth.loginUser);

router.post("/sendVeficationOTP", Auth.sendOtp);
router.post("/VerifyOTPVerification", Auth.verifyOtp);

router.post("/sendOtpEmail", Auth.sendOtpEmail);
router.post("/loginOtpVerifyEmail", Auth.OtpVerifyEmail);

router.post("/sendOtpMobile", Auth.sendOtpMobile);
router.post("/loginOtpVerifyMobile", Auth.loginPhoneVerify);

router.post("/forgotPassword", Auth.forgotPassword);
router.post("/verifyForgotPassword", Auth.verifyForgotPassword);
router.post("/resetPassword", Auth.resetPassword);

router.put("/updateFCMToken/:person_id", Auth.updateFcmToken);

router.get("/users", Auth.getAllUsers);

router.post("/delete-account/reason", verifyToken, Auth.createDeleteReason);
router.post("/delete-account/verify", verifyToken, Auth.verifyDeleteRequest);
router.post("/delete-account/confirm", verifyToken, Auth.confirmDeleteAccount);
router.post("/exsiting-user", Auth.checkExisitingUser);
router.get("/getUserCount", Auth.getCountUsers);

module.exports = router;
