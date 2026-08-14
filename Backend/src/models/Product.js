import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['tops', 'bottoms', 'jorts', 'hoodies', 'graphic-tees', 'denim', 'jackets', 'jerseys', 'accessories', 'bags'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 1,
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'Product must have at least one image',
      },
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['like new', 'good', 'fair'],
    },
    size: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
    },
    drop: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ drop: 1, status: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
