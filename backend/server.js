import express from 'express';
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

let dbReady;
const connectAndSeed = async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-management');
  await seedDemoUser();
  await seedDefaultDoctors();
};

const ensureDatabase = () => {
  if (!dbReady) dbReady = connectAndSeed();
  return dbReady;
};

app.get('/', (_req, res) => {
  res.json({ status: 'Online Hospital Management API running' });
});

app.use('/api', async (_req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (err) {
    console.error('Database connection failed', err);
    res.status(500).json({ message: 'Database connection failed' });
  }
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
    await ensureDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

if (process.env.VERCEL !== '1') {
  start();
}

export default app;
