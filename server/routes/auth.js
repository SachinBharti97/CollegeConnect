const express = require('express');
const router = express.Router();
const { signup, login, requestOTP, verifyOTP } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
