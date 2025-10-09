const adminModel = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createAdmin(data) {
  // Step 1: generate plain random password
  const plainPassword = Math.random().toString(36).slice(-8);
  // e.g. "a9fj2kz1" (8 chars)

  // Step 2: hash with bcrypt
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Step 3: save admin
  const admin = await adminModel.create({
    email: data.email,
    password: hashedPassword,
    role: data.role || "admin",
  });

  // Step 4: return admin + plain password (to show/send to user)
  return { admin, plainPassword };
}

async function loginAdmin(email, password) {
  const admin = await adminModel.findOne({ email });
  if (!admin) throw new Error("Admin not found");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: admin._id, firstLogin: admin.isFirstLogin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  return { admin, token };
}

async function changePassword(email, newPassword) {
  const admin = await adminModel.findOne({ email });
  if (!admin) throw new Error("Admin not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  admin.isFirstLogin = false;
  await admin.save();

  const token = jwt.sign(
    { id: admin._id, firstLogin: false },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  return { admin, token };
}


module.exports = {
  createAdmin,
  loginAdmin,
  changePassword,
};
