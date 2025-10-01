const currencyRatesService = require("../services/currencyRates.service");

exports.getCurrencyRates = async (req, res) => {
  try {
    let { currencyCode } = req.params;
    const currencyRates = await currencyRatesService.getCurrencyRates(currencyCode);
    res.json({ success: true, data: currencyRates });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
