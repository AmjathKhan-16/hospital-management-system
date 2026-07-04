import express from 'express';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';
import { addMedicalRecord, getAssignedAppointments, getDoctors, getMyProfile, updateAppointmentStatus } from '../controllers/doctorController.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin', 'patient'), getDoctors);
router.get('/me', protect, authorizeRoles('doctor'), getMyProfile);
router.get('/me/appointments', protect, authorizeRoles('doctor'), getAssignedAppointments);
router.patch('/appointments/:id', protect, authorizeRoles('doctor', 'admin'), updateAppointmentStatus);
router.post('/records', protect, authorizeRoles('doctor'), addMedicalRecord);

export default router;