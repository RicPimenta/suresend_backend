const Referral = require("../models/referral.model");
const crypto = require("crypto");

function generateCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A1B2C3D4"
}

exports.createReferralCode = async (userId) => {
  console.log(userId);
  const code = await generateCode();
   console.log(code);
  await Referral.createCode(userId, code);
  return code;
};

exports.redeemReferralCode = async (code, referredId) => {
  const ref = await Referral.getByCode(code);
  console.log(ref);
  if (!ref) throw new Error("Invalid code");
  if (ref.person_id === referredId) throw new Error("Self-referral not allowed");

  await Referral.useCode(ref.person_id, referredId);
  return { referrerId: ref.person_id };
};

exports.getReferralStats = async (userId) => {
  const total = await Referral.getStats(userId);
  return { total };
};
