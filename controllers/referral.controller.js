const referralService = require("../services/referral.service");

exports.createCode = async (req, res) => {
  try {
    const code = await referralService.createReferralCode(req.body.userId);
    res.json({ success: true, code });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.redeemCode = async (req, res) => {
  try {
    const out = await referralService.redeemReferralCode(
      req.body.code,
      req.body.userId
    );
    res.json({ success: true, ...out });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const out = await referralService.getReferralStats(req.params.userId);
    res.json({ success: true, ...out });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
