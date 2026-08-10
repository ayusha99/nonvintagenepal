import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
} from '../controllers/productController.js';
import { upload } from '../config/cloudinary.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Serve uploaded images (local storage fallback)
router.use('/images', express.static('uploads'));

// Admin routes (protected)
router.post('/upload', protect, isAdmin, upload.array('images', 5), uploadImages);
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

export default router;
