import express from 'express';
import {
  signup,
  login,
  getMe,
  logout,
  updateProfile,
  uploadProfilePicture,
  removeProfilePicture,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use('/uploads', express.static('uploads'));

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/profile/picture', protect, upload.single('picture'), uploadProfilePicture);
router.delete('/profile/picture', protect, removeProfilePicture);

export default router;
