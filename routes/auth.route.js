const express = require("express");
const router = express.Router();
const Auth = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

router.post("/create", Auth.createUser);
router.post("/login", Auth.loginUser);
// router.get("/profile", authMiddleware, Auth.getProfile);
// router.post("/logout", authMiddleware, Auth.logoutUser);

// router.post("/forgot-password", Auth.forgotPassword);
// router.post("/reset-password", Auth.resetPassword);

module.exports = router;
