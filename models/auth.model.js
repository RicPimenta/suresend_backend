const pool = require("../config/db"); // pg Pool

const checkExisitingUser = async (email) => {
  const res = await pool.query("SELECT * FROM Person WHERE email = $1", [
    email,
  ]);
  return res.rows.length > 0 ? res.rows[0] : null;
};

const checkExisitingUserMobile = async (cell) => {
  const res = await pool.query("SELECT * FROM Person WHERE cell = $1", [cell]);
  return res.rows.length > 0 ? res.rows[0] : null;
};

const updatePassword = async (id, password) => {
  console.log("Updating password for user:", id);
  const res = await pool.query(
    'UPDATE Person SET "password" = $1 WHERE person_id = $2 RETURNING *',
    [password, id]
  );
  console.log("Update result:", res.rowCount, res.rows);
  return res.rows[0];
};

const findOneEmail = async (email) => {
  const res = await pool.query("SELECT * FROM Person WHERE email = $1", [
    email,
  ]);
  return res.rows[0] || null;
};

const createUser = async ({
  first_name,
  middle_name,
  last_name,
  dob,
  country_of_residence,
  secret_pin,
  password,
  email,
  cell,
  address,
}) => {
  const res = await pool.query(
    "INSERT INTO Person (first_name, middle_name, last_name, dob, country_of_residence, secret_pin, password, email, cell, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    [
      first_name,
      middle_name,
      last_name,
      dob,
      country_of_residence,
      secret_pin,
      password,
      email,
      cell,
      address,
    ]
  );
  return res.rows[0];
};

module.exports = {
  checkExisitingUser,
  findOneEmail,
  createUser,
  checkExisitingUserMobile,
  updatePassword,
};
