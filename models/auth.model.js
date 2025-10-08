const pool = require("../config/db"); // pg Pool

const checkExisitingUser = async (email) => {
  const res = await pool.query("SELECT * FROM Person WHERE email = $1 AND is_deleted = false", [
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

const updateFcmToken = async (personId, fcmToken) => {
  try {
    const query = `
        UPDATE Person
        SET fcm_token = $1
        WHERE person_id = $2
        RETURNING person_id, email, fcm_token;
      `;
    const values = [fcmToken, personId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const findOneEmail = async (email) => {
  const res = await pool.query("SELECT * FROM Person WHERE email = $1 AND is_deleted = false", [
    email,
  ]);
  return res.rows[0] || null;
};

const findOneCell = async (cell) => {
  const res = await pool.query("SELECT * FROM Person WHERE cell = $1 AND is_deleted = false", [cell]);
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
  google_id,
  apple_id,
}) => {
  const res = await pool.query(
    "INSERT INTO Person (first_name, middle_name, last_name, dob, country_of_residence, secret_pin, password, email, cell, address, google_id, apple_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
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
      google_id,
      apple_id,
    ]
  );
  return res.rows[0];
};

const getAllUsers = async () => {
  const res = await pool.query(
    "SELECT person_id, first_name, middle_name, last_name, dob, country_of_residence, email, cell, address FROM Person ORDER BY person_id ASC"
  );
  return res.rows;
};

// Create a delete reasson
const createDeleteReason = async (userId, reason) => {
  const result = await pool.query(
    "INSERT INTO DeleteReason (person_id, reason) VALUES ($1, $2) RETURNING id",
    [userId, reason]
  );
  return result.rows[0];
};

const getUserById = async (userId) => {
  const result = await pool.query("SELECT * FROM Person WHERE person_id = $1", [userId]);
  return result.rows[0] || null;
};

// Verify delete request by id and user
const verifyDeleteRequest = async (deleteRequestId, userId) => {
  const result = await pool.query(
    "UPDATE DeleteReason SET status = 'verified', verified_at = NOW() WHERE id = $1 AND person_id = $2 RETURNING *",
    [deleteRequestId, userId]
  );
  return result.rows[0] || null; 
};

// Get verified delete request by id and user
const getVerifiedDeleteRequest = async (deleteRequestId, userId) => {
  const result = await pool.query(
    "SELECT * FROM DeleteReason WHERE id=$1 AND person_id=$2 AND status='verified'",
    [deleteRequestId, userId]
  );
  return result.rows[0] || null;
};

// Mark delete request as completed
const completeDeleteRequest = async (deleteRequestId) => {
  const result = await pool.query(
    "UPDATE DeleteReason SET status='completed', completed_at=NOW() WHERE id=$1 RETURNING *",
    [deleteRequestId]
  );
  return result.rows[0] || null;
};

// Mark user as deleted
const deleteUser = async (userId) => {
  const result = await pool.query(
    "UPDATE Person SET is_deleted=true, deleted_at=NOW() WHERE person_id=$1 RETURNING *",
    [userId]
  );
  return result.rows[0] || null;
};

const getCountUsers = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM Person");
  return parseInt(res.rows[0].count, 10);
}

module.exports = {
  checkExisitingUser,
  findOneEmail,
  createUser,
  checkExisitingUserMobile,
  updatePassword,
  updateFcmToken,
  getAllUsers,
  createDeleteReason,
  getUserById,
  verifyDeleteRequest,
  getVerifiedDeleteRequest,
  completeDeleteRequest,
  deleteUser,
  findOneCell,
  getCountUsers
};
