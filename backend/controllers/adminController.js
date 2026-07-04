import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import { generateOtp, sendOtpEmail } from '../utils/email.js';

export const getDoctors = async (_req, res) => {
  const doctors = await Doctor.find().populate('userId', 'name email');
  res.json(doctors);
};

export const getPatients = async (_req, res) => {
  const patients = await Patient.find().populate('userId', 'name email isEmailVerified');
  res.json(patients);
};

export const getAllAppointments = async (_req, res) => {
  const appointments = await Appointment.find()
    .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
    .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });
  res.json(appointments);
};

export const stats = async (_req, res) => {
  const users = await User.countDocuments();
  const doctors = await Doctor.countDocuments();
  const patients = await Patient.countDocuments();
  const appointments = await Appointment.countDocuments();
  res.json({ users, doctors, patients, appointments });
};

export const createDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, availability } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      role: 'doctor',
      isEmailVerified: true
    });
    const doctor = await Doctor.create({
      userId: user._id,
      specialization: specialization || 'General Medicine',
      availability: availability || 'Mon-Fri, 9:00 AM - 5:00 PM'
    });
    await doctor.populate('userId', 'name email');
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Unable to create doctor', error: err.message });
  }
};

export const createPatientAccount = async (req, res) => {
  try {
    const { name, email, password, age, gender, medicalHistory, location, parentName, parentPhone, guardianName, guardianPhone, phone, emergencyContact, photoUrl } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const otp = generateOtp();
    const user = await User.create({
      name,
      email,
      password,
      role: 'patient',
      emailOtp: otp,
      emailOtpExpires: new Date(Date.now() + 10 * 60 * 1000)
    });
    const patient = await Patient.create({
      userId: user._id,
      age: age || 0,
      gender: gender || 'other',
      medicalHistory: medicalHistory || ''
    });
    await patient.populate('userId', 'name email isEmailVerified');
    const mail = await sendOtpEmail(user.email, otp);
    res.status(201).json({ patient, devOtp: otp, mail });
  } catch (err) {
    res.status(500).json({ message: 'Unable to create patient account', error: err.message });
  }
};