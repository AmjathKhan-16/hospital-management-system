import express from 'express';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';
import { bookAppointment, getAppointments, rescheduleAppointment, updateStatus } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('patient'), bookAppointment);
router.get('/', protect, authorizeRoles('patient', 'doctor', 'admin'), getAppointments);
router.patch('/:id/reschedule', protect, authorizeRoles('patient'), rescheduleAppointment);
router.patch('/:id', protect, authorizeRoles('doctor', 'admin'), updateStatus);

export default router;