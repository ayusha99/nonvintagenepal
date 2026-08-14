import express from 'express';
import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from '../controllers/contactController.js';
import { protect, isAdmin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalProtect, createMessage);
router.get('/', protect, isAdmin, getMessages);
router.put('/:id', protect, isAdmin, updateMessage);
router.delete('/:id', protect, isAdmin, deleteMessage);

export default router;
