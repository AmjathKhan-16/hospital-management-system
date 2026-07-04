import express from 'express';
import { login, register, updateMyPhoto, verifyOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.patch('/me/photo', protect, updateMyPhoto);

export default router;

