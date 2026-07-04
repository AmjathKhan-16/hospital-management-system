import MedicalRecord from '../models/MedicalRecord.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const getRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await MedicalRecord.find({ patientId }).populate('doctorId', 'specialization');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch records', error: err.message });
  }
};

export const createRecord = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const { patientId, diagnosis, prescription } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const record = await MedicalRecord.create({ patientId, doctorId: doctor._id, diagnosis, prescription });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Unable to create record', error: err.message });
  }
};
