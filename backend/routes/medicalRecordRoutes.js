import express from 'express';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';
import { createRecord, getRecordsByPatient } from '../controllers/medicalRecordController.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('doctor'), createRecord);
router.get('/patient/:patientId', protect, authorizeRoles('patient', 'doctor', 'admin'), getRecordsByPatient);

export default router;
