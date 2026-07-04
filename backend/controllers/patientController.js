import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';

const profileFields = [
  'age',
  'gender',
  'medicalHistory',
  'location',
  'parentName',
  'parentPhone',
  'guardianName',
  'guardianPhone',
  'phone',
  'emergencyContact',
  'photoUrl'
];

export const createPatient = async (req, res) => {
  try {
    const patientData = profileFields.reduce((data, field) => {
      if (req.body[field] !== undefined) data[field] = req.body[field];
      return data;
    }, { userId: req.body.userId });
    const patient = await Patient.create(patientData);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Unable to create patient', error: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id }).populate('userId', 'name email role');
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch profile', error: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    profileFields.forEach((field) => {
      if (req.body[field] !== undefined) patient[field] = req.body[field];
    });

    await patient.save();
    await patient.populate('userId', 'name email role');
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Unable to update profile', error: err.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const appointments = await Appointment.find({ patientId: patient._id }).populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name email' }
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch appointments', error: err.message });
  }
};

export const getMyRecords = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const records = await MedicalRecord.find({ patientId: patient._id }).populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name email' }
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch records', error: err.message });
  }
};