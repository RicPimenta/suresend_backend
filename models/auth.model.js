const pool = require("../config/db"); // pg Pool

const checkExisitingUser = async (email) => {
  const res = await pool.query(
    "SELECT * FROM Person WHERE email = $1",
    [email]
  );
  return res.rows.length > 0 ? res.rows[0] : null;
};

const findOneEmail = async (email) => {
  const res = await pool.query(
    "SELECT * FROM Person WHERE email = $1",
    [email]
  );
  return res.rows[0] || null;
};

const createUser = async ({ name, password, email, cell, address }) => {
  const res = await pool.query(
    "INSERT INTO Person (name, password, email, cell, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, password, email, cell, address]
  );
  return res.rows[0];
};

module.exports = {
  checkExisitingUser,
  findOneEmail,
  createUser,
};
