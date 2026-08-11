import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getWishlist,
  toggleWishlist,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect); // All routes here require authentication

router.route('/wishlist')
  .get(getWishlist)
  .post(toggleWishlist);

export default router;
