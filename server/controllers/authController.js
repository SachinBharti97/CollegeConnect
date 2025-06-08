const { generateOTP, hashOTP } = require('../utils/otp');
const { sendOTP } = require('../utils/sms');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.requestOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const otp = generateOTP();
    const hashed = hashOTP(otp);
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }
    user.otp = hashed;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOTP(phone, otp);
    res.json({ message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !user.otp || !user.otpExpires) return res.status(400).json({ message: 'No OTP requested' });
    if (user.otp !== hashOTP(otp) || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    // Optionally, create a JWT token here for login
    res.json({ message: 'Phone verified', user });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Return user object with id, name, email, and role
    res.status(201).json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role || 'user',
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Return user object with id, name, email, and role
    res.json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role || 'user',
      },
      token
    });
  } catch (err) {
    next(err);
  }
};
