const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendOtp, verifyOtp } = require('../controllers/authController');

// OTP Routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// User Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
