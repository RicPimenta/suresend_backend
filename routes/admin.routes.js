const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.post('/create', adminController.createAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/change-password', adminController.changePassword);

module.exports = router;