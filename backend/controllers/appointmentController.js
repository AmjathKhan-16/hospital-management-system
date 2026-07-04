import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

const populateAppointment = async (appointment) => {
  await appointment.populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } });
  await appointment.populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });
  return appointment;
};

export const bookAppointment = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    const { doctorId, date, notes } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      date,
      notes
    });
    res.status(201).json(await populateAppointment(appointment));
  } catch (err) {
    res.status(500).json({ message: 'Unable to book appointment', error: err.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      filter = { patientId: patient?._id };
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      filter = { doctorId: doctor?._id };
    }
    const appointments = await Appointment.find(filter)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch appointments', error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    const { status, date } = req.body;
    if (status) appointment.status = status;
    if (date) appointment.date = date;
    await appointment.save();
    res.json(await populateAppointment(appointment));
  } catch (err) {
    res.status(500).json({ message: 'Unable to update appointment', error: err.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.patientId.toString() !== patient._id.toString()) {
      return res.status(403).json({ message: 'You can only reschedule your own appointment' });
    }

    const { date } = req.body;
    if (!date) return res.status(400).json({ message: 'New appointment date is required' });

    appointment.date = date;
    appointment.status = 'rescheduled';
    await appointment.save();
    res.json(await populateAppointment(appointment));
  } catch (err) {
    res.status(500).json({ message: 'Unable to reschedule appointment', error: err.message });
  }
};