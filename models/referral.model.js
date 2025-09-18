const pool = require("../config/db");

// Referral.js
class Referral {
  static async createCode(personId, code) {
    const res = await pool.query(
      `
      INSERT INTO referral_codes (person_id, code)
      VALUES ($1, $2)
      ON CONFLICT (person_id) 
      DO UPDATE SET code = EXCLUDED.code
      RETURNING *
      `,
      [personId, code]
    );
    return res.rows[0];
  }

  static async getByCode(code) {
    const res = await pool.query(
      "SELECT * FROM referral_codes WHERE code = $1",
      [code]
    );
    return res.rows.length > 0 ? res.rows[0] : null;
  }

  static async useCode(referrerId, referredId) {
    const res = await pool.query(
      `
      INSERT INTO referral_uses (referrer_id, referred_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [referrerId, referredId]
    );
    return res.rows[0];
  }

  static async getStats(personId) {
    const res = await pool.query(
      "SELECT COUNT(*) as total FROM referral_uses WHERE referrer_id = $1",
      [personId]
    );
    return parseInt(res.rows[0].total, 10);
  }
}

module.exports = Referral;