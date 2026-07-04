import express from 'express';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';
import { createPatient, getMyAppointments, getMyProfile, getMyRecords, updateMyProfile } from '../controllers/patientController.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), createPatient);
router.get('/me', protect, authorizeRoles('patient'), getMyProfile);
router.patch('/me', protect, authorizeRoles('patient'), updateMyProfile);
router.get('/me/appointments', protect, authorizeRoles('patient'), getMyAppointments);
router.get('/me/records', protect, authorizeRoles('patient'), getMyRecords);

export default router;