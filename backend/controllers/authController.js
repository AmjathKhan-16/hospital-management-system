import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import { generateOtp, sendOtpEmail } from '../utils/email.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'changeme', {
    expiresIn: '7d'
  });
};

const toAuthUser = (user) => ({
  id: user._id,
  name: user.name,
  role: user.role,
  email: user.email,
  photoUrl: user.photoUrl || ''
});

export const register = async (req, res) => {
  try {
    const { name, email, password, role, age, gender, medicalHistory, location, parentName, parentPhone, guardianName, guardianPhone, phone, emergencyContact, photoUrl } = req.body;
    if (role && role !== 'patient') {
      return res.status(403).json({ message: 'Public registration is only available for patients' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const otp = generateOtp();
    const user = await User.create({
      name,
      email,
      password,
      role: 'patient',
      emailOtp: otp,
      emailOtpExpires: new Date(Date.now() + 10 * 60 * 1000)
    });

    await Patient.create({
      userId: user._id,
      age: age || 0,
      gender: gender || 'other',
      medicalHistory: medicalHistory || ''
    });

    const mail = await sendOtpEmail(user.email, otp);
    res.status(201).json({
      message: 'Patient account created. Verify the email OTP before login.',
      email: user.email,
      devOtp: otp,
      mail
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Account not found' });
    if (user.isEmailVerified) return res.json({ message: 'Email already verified' });
    if (!user.emailOtp || user.emailOtp !== otp || user.emailOtpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    await user.save();
    res.json({ message: 'Email verified. You can login now.' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.role !== 'admin' && !user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email OTP before login' });
    }
    const token = generateToken(user._id, user.role);
    res.json({ token, user: toAuthUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const updateMyPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (typeof photoUrl !== 'string' || !photoUrl.trim()) {
      return res.status(400).json({ message: 'Photo is required' });
    }

    req.user.photoUrl = photoUrl;
    await req.user.save();
    res.json(toAuthUser(req.user));
  } catch (err) {
    res.status(500).json({ message: 'Unable to update photo', error: err.message });
  }
};


