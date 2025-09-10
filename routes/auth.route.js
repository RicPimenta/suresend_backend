const express = require("express");
const router = express.Router();
const Auth = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

router.post("/create", Auth.createUser);
router.post("/login", Auth.loginUser);
router.post("/sendOtpEmail", Auth.sendOtp);
router.post("/loginOtpVerifyEmail", Auth.OtpVerify);

module.exports = router;
