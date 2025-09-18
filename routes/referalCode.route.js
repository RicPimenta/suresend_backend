const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referral.controller");

router.post("/create", referralController.createCode);
router.post("/redeem", referralController.redeemCode);
router.get("/stats/:userId", referralController.stats);

module.exports = router;
