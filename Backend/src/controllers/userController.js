import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get user wishlist
// @route   GET /api/user/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or remove product from wishlist
// @route   POST /api/user/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Please provide a product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if product is already in wishlist
    const isLiked = user.wishlist.includes(productId);

    if (isLiked) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isLiked: !isLiked,
      message: isLiked ? 'Removed from wishlist' : 'Added to wishlist',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
