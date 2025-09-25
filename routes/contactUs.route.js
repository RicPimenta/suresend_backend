const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/contactUs.controller");

router.post("/create", contactUsController.createContactUs);

module.exports = router;
