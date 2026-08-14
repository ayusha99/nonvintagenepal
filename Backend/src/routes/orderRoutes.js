import express from 'express';
import { createOrder, getOrders, getMyOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, isAdmin, getOrders);
router.put('/:id', protect, isAdmin, updateOrderStatus);

export default router;
