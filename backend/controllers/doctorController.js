import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Patient from '../models/Patient.js';

export const getDoctors = async (_req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch doctors', error: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch profile', error: err.message });
  }
};

export const getAssignedAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const appointments = await Appointment.find({ doctorId: doctor._id }).populate({
      path: 'patientId',
      populate: { path: 'userId', select: 'name email' }
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch appointments', error: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { status, date } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (status) appointment.status = status;
    if (date) appointment.date = date;
    await appointment.save();
    await appointment.populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } });
    await appointment.populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Unable to update appointment', error: err.message });
  }
};

export const addMedicalRecord = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const { patientId, diagnosis, prescription } = req.body;
    const patientExists = await Patient.findById(patientId);
    if (!patientExists) return res.status(404).json({ message: 'Patient not found' });
    const record = await MedicalRecord.create({
      patientId,
      doctorId: doctor._id,
      diagnosis,
      prescription
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Unable to add record', error: err.message });
  }
};