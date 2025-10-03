const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  isFirstLogin : { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
