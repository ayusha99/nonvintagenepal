import express from 'express';
import { getNotifications, getCustomers, getCustomer, updateCustomer } from '../controllers/adminController.js';
import { getAdminDrops, createDrop, updateDrop, deleteDrop } from '../controllers/dropController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, isAdmin);

router.get('/notifications', getNotifications);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomer);
router.put('/customers/:id', updateCustomer);

router.get('/drops', getAdminDrops);
router.post('/drops', createDrop);
router.put('/drops/:id', updateDrop);
router.delete('/drops/:id', deleteDrop);

export default router;
