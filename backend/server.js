import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { connectDB } from './config/db.js';
import { seedDemoUser } from './config/seedDemoUser.js';
import { seedDefaultDoctors } from './config/seedDefaultDoctors.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'Online Hospital Management API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-management');
    await seedDemoUser();
    await seedDefaultDoctors();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();