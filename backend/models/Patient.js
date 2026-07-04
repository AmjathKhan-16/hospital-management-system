import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    medicalHistory: { type: String, default: '' },
    location: { type: String, default: '' },
    parentName: { type: String, default: '' },
    parentPhone: { type: String, default: '' },
    guardianName: { type: String, default: '' },
    guardianPhone: { type: String, default: '' },
    phone: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    photoUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;