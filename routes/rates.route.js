const express = require("express");
const router = express.Router();
const currencyRatesController = require("../controllers/currencyRates.controller");

router.get("/getCurrencyRates/:currencyCode", currencyRatesController.getCurrencyRates);

module.exports = router;
