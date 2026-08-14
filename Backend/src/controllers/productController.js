import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';
import { hasCloudinaryConfig } from '../config/cloudinary.js';
import Drop from '../models/Drop.js';

// @desc    Get all available products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, status, drop } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (drop) filter.drop = drop;
    if (status === 'all') {
      // Admin: return every product regardless of status
    } else if (status) {
      filter.status = status;
    } else {
      filter.status = 'available';
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid product ID', 400));
    }
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, condition, size, brand, stock, drop } = req.body;

    // Images will be uploaded via separate endpoint
    const images = req.body.images || [];

    if (images.length === 0) {
      return next(new AppError('At least one image is required', 400));
    }

    if (drop) {
      const dropExists = await Drop.findOne({ slug: drop, isActive: true });
      if (!dropExists) {
        return next(new AppError('Invalid or inactive drop', 400));
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      images,
      condition,
      size,
      brand,
      stock: stock !== undefined ? Number(stock) : 1,
      status: Number(stock) === 0 ? 'sold' : 'available',
      drop: drop || '',
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (req.body.drop) {
      const dropExists = await Drop.findOne({ slug: req.body.drop, isActive: true });
      if (!dropExists) {
        return next(new AppError('Invalid or inactive drop', 400));
      }
    }

    if (req.body.stock !== undefined) {
      req.body.stock = Number(req.body.stock);
      if (req.body.stock <= 0) {
        req.body.status = 'sold';
      } else if (product.status === 'sold') {
        req.body.status = 'available';
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private/Admin
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No images uploaded', 400));
    }

    let imageUrls;
    
    if (hasCloudinaryConfig) {
      // Cloudinary URLs
      imageUrls = req.files.map((file) => file.path);
    } else {
      // Local storage URLs
      imageUrls = req.files.map((file) => {
        return `${req.protocol}://${req.get('host')}/api/products/images/${file.filename}`;
      });
    }

    res.json({
      success: true,
      data: imageUrls,
    });
  } catch (error) {
    next(error);
  }
};
