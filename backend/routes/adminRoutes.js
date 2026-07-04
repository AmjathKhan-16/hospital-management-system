import express from 'express';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';
import { createDoctor, createPatientAccount, getAllAppointments, getDoctors, getPatients, stats } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/doctors', getDoctors);
router.post('/doctors', createDoctor);
router.get('/patients', getPatients);
router.post('/patients', createPatientAccount);
router.get('/appointments', getAllAppointments);
router.get('/stats', stats);

export default router;