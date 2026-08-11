import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, CreditCard, Truck, ShoppingCart, Minus, Plus } from 'lucide-react';
import api from '../api/axios';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import AddToCartModal from '../components/AddToCartModal';
import AnimatedProductCard from '../components/AnimatedProductCard';
import { getDeliveryLabel, DELIVERY_DAYS } from '../utils/shipping';

const CONDITION_LABELS = {
  'like new': { label: 'Like New', className: 'bg-gray-100 text-gray-700' },
  good: { label: 'Good', className: 'bg-gray-100 text-gray-700' },
  fair: { label: 'Fair', className: 'bg-gray-100 text-gray-700' },
};

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { addItem } = useCartStore();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
    if (user) checkWishlist();
  }, [id, user]);

  useEffect(() => {
    if (product) fetchSimilarProducts(product.category, product._id);
  }, [product]);

  const checkWishlist = async () => {
    try {
      const response = await api.get('/user/wishlist');
      setInWishlist(response.data.data.some((p) => p._id === id));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async (category, currentId) => {
    try {
      const response = await api.get('/products', { params: { category, status: 'available' } });
      setSimilarProducts(response.data.data.filter((p) => p._id !== currentId).slice(0, 4));
    } catch (error) {
      console.error('Error fetching similar products:', error);
    }
  };

  const handleAddToCart = () => {
    if (product && product.status === 'available') {
      addItem(product, quantity);
      setShowCartModal(true);
    }
  };

  const handleBuyNow = () => {
    if (product && product.status === 'available') {
      addItem(product, quantity);
      navigate('/checkout', {
        state: {
          from: 'product',
          product: {
            id: product._id,
            name: product.name,
            category: product.category,
          },
        },
      });
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.post('/user/wishlist', { productId: id });
      setInWishlist(response.data.isLiked);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Product not found</p>
      </div>
    );
  }

  const isSold = product.status === 'sold';
  const conditionInfo = CONDITION_LABELS[product.condition] || CONDITION_LABELS.fair;
  const deliveryLabel = getDeliveryLabel(DELIVERY_DAYS.min, DELIVERY_DAYS.max);
  const productSize = product.size?.toUpperCase();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {showCartModal && (
        <AddToCartModal product={product} quantity={quantity} onClose={() => setShowCartModal(false)} />
      )}

      {/* Breadcrumbs */}
      <div className="border-b border-gray-100 py-2.5 px-6 lg:px-12 text-[10px] text-gray-400 uppercase tracking-widest font-medium flex items-center gap-1.5">
        <Link to="/products" className="hover:text-gray-900 transition-colors">Shop</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-gray-900 capitalize transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-700 truncate">{product.name}</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

          {/* Image Gallery */}
          <div>
            {/* Main image — square, fills frame */}
            <div className="relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden mb-2">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((p) => (p - 1 + product.images.length) % product.images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 text-gray-700 rounded-full flex items-center justify-center hover:bg-white shadow-sm border border-gray-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    onClick={() => setSelectedImage((p) => (p + 1) % product.images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 text-gray-700 rounded-full flex items-center justify-center hover:bg-white shadow-sm border border-gray-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
              {isSold && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-black text-white px-5 py-2 text-[10px] font-bold tracking-widest uppercase">Sold Out</span>
                </div>
              )}
            </div>

            {/* Thumbnails — horizontal strip */}
            {product.images.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-14 h-14 flex-shrink-0 overflow-hidden border transition-all ${
                      selectedImage === index ? 'border-gray-900 opacity-100' : 'border-gray-200 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Brand + Title */}
            {product.brand && (
              <p className="text-xs font-bold uppercase tracking-wide text-gray-900 mb-1">{product.brand}</p>
            )}
            <h1 className="text-xl font-semibold text-gray-900 leading-snug mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${conditionInfo.className}`}>
                {conditionInfo.label}
              </span>
              {product.size && (
                <span className="text-xs text-gray-500">Size {product.size}</span>
              )}
            </div>

            {/* Price */}
            <p className="text-lg font-bold text-gray-900 mb-5">
              Rs. {product.price.toLocaleString()}
            </p>

            {/* Size */}
            {product.size && (
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Size</p>
                <div className="flex gap-1.5">
                  {SIZES.map((size) => {
                    const isActive = productSize === size;
                    return (
                      <button
                        key={size}
                        disabled={!isActive}
                        className={`w-8 h-8 text-[11px] font-medium border transition-colors ${
                          isActive
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 bg-white text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isSold}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={isSold}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[10px] text-gray-400">{isSold ? 'Out of stock' : '1 available'}</span>
              </div>
            </div>

            {/* Shipping */}
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4 pb-4 border-b border-gray-100">
              <Truck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{deliveryLabel} · Rs. 150 delivery · Free over Rs. 3,000</span>
            </div>

            {/* Payment methods — compact */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Payment</p>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] text-gray-600 border border-gray-200 px-2.5 py-1">
                  <CreditCard className="w-3 h-3" /> Online
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-600 border border-gray-200 px-2.5 py-1">
                  <Truck className="w-3 h-3" /> COD
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 mb-3">
              {isSold ? (
                <button disabled className="w-full py-2.5 text-[11px] font-bold uppercase tracking-widest bg-gray-100 text-gray-400 cursor-not-allowed">
                  Out of Stock
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2.5 text-[11px] font-bold uppercase tracking-widest bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-2.5 text-[11px] font-bold uppercase tracking-widest border border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Buy It Now
                  </button>
                </>
              )}
              <button
                onClick={handleWishlist}
                className="w-full py-2.5 text-[11px] font-bold uppercase tracking-widest border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                {inWishlist ? 'Saved' : 'Wishlist'}
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center">
              Secure checkout · 14-day returns
            </p>
          </div>
        </div>

        {/* Description — full width below */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap max-w-2xl">
            {product.description}
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
            {product.brand && (
              <div>
                <span className="text-[10px] uppercase tracking-wide text-gray-400">Brand</span>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{product.brand}</p>
              </div>
            )}
            {product.category && (
              <div>
                <span className="text-[10px] uppercase tracking-wide text-gray-400">Category</span>
                <p className="text-sm font-medium text-gray-800 capitalize mt-0.5">{product.category}</p>
              </div>
            )}
            {product.size && (
              <div>
                <span className="text-[10px] uppercase tracking-wide text-gray-400">Size</span>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{product.size}</p>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase tracking-wide text-gray-400">Condition</span>
              <p className="text-sm font-medium text-gray-800 capitalize mt-0.5">{product.condition}</p>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Similar Listings</h3>
          {similarProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {similarProducts.map((p, index) => (
                <AnimatedProductCard key={p._id} product={p} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-6 text-center border border-gray-100 bg-gray-50/50">
              No similar products available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
