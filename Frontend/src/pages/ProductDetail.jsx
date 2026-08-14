import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../api/axios';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import AddToCartModal from '../components/AddToCartModal';
import AnimatedProductCard from '../components/AnimatedProductCard';
import { getDeliveryLabel, DELIVERY_DAYS } from '../utils/shipping';
import { buildProductBreadcrumbs } from '../utils/breadcrumbs';
import { getCategoryLabel, normalizeCategorySlug } from '../constants/categories';
import { useDrops } from '../hooks/useDrops';

const SIZE_CHART = [
  { size: 'S', chest: '34–36"', length: '26"', fit: 'Small' },
  { size: 'M', chest: '38–40"', length: '27"', fit: 'Medium' },
  { size: 'L', chest: '42–44"', length: '28"', fit: 'Large' },
  { size: 'XL', chest: '46–48"', length: '29"', fit: 'Extra Large' },
  { size: '2XL', chest: '50–52"', length: '30"', fit: '2X Large' },
];

function AccordionRow({ title, open, onToggle, children }) {
  return (
    <div className="border border-black -mt-px first:mt-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-3 text-left text-sm text-black hover:bg-black/[0.03] transition-colors"
      >
        <span>{title}</span>
        <span className="text-lg leading-none font-light w-5 text-center">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-2 text-xs text-gray-700 leading-relaxed border-t border-black/10">
          {children}
        </div>
      )}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [openSection, setOpenSection] = useState('');
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { drops } = useDrops();

  useEffect(() => {
    if (product) {
      setBreadcrumbs(buildProductBreadcrumbs(product, { drops }));
    }
  }, [product, drops, setBreadcrumbs]);

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
      addItem(product, 1);
      setShowCartModal(true);
    }
  };

  const handleBuyNow = () => {
    if (product && product.status === 'available') {
      addItem(product, 1);
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

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? '' : section));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 text-xs uppercase tracking-wider font-semibold">Product not found</p>
      </div>
    );
  }

  const isSold = product.status === 'sold' || (product.stock ?? 1) <= 0;
  const normalizedSize = product.size?.toUpperCase()?.replace('XXL', '2XL');
  const deliveryLabel = getDeliveryLabel(DELIVERY_DAYS.min, DELIVERY_DAYS.max);
  const formattedPrice = `Rs. ${product.price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {showCartModal && (
        <AddToCartModal product={product} quantity={1} onClose={() => setShowCartModal(false)} />
      )}

      {/* ─── Editorial 3-column layout ─── */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 pt-3 pb-10 lg:pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,380px)_1fr] gap-6 lg:gap-9 xl:gap-10 lg:items-center">

          {/* Left — title, price, accordions */}
          <div className="order-2 lg:order-1 flex flex-col lg:max-w-sm xl:max-w-md lg:justify-self-end lg:w-full">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div className="min-w-0">
                {product.brand && (
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">{product.brand}</p>
                )}
                <h1
                  className="text-xl sm:text-2xl font-black uppercase leading-tight tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {product.name}
                </h1>
              </div>
              <button
                type="button"
                onClick={handleWishlist}
                className="p-1.5 shrink-0 text-gray-500 hover:text-black transition-colors mt-1"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            <p className="text-base text-black mb-6">{formattedPrice}</p>

            <div>
              <AccordionRow
                title="Product Details"
                open={openSection === 'details'}
                onToggle={() => toggleSection('details')}
              >
                {product.description && (
                  <p className="whitespace-pre-wrap mb-3 text-gray-600">{product.description}</p>
                )}
                <dl className="space-y-2">
                  {product.category && (
                    <div className="flex justify-between gap-4 border-b border-black/5 pb-2">
                      <dt className="text-gray-400 uppercase tracking-wider shrink-0">Category</dt>
                      <dd className="text-black text-right capitalize">
                        {getCategoryLabel(normalizeCategorySlug(product.category))}
                      </dd>
                    </div>
                  )}
                  {product.condition && (
                    <div className="flex justify-between gap-4 border-b border-black/5 pb-2">
                      <dt className="text-gray-400 uppercase tracking-wider shrink-0">Condition</dt>
                      <dd className="text-black text-right capitalize">{product.condition}</dd>
                    </div>
                  )}
                  {product.size && (
                    <div className="flex justify-between gap-4 border-b border-black/5 pb-2">
                      <dt className="text-gray-400 uppercase tracking-wider shrink-0">Size</dt>
                      <dd className="text-black text-right">{product.size}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 pb-0.5">
                    <dt className="text-gray-400 uppercase tracking-wider shrink-0">Stock</dt>
                    <dd className="text-black text-right">{isSold ? 'Sold out' : `${product.stock ?? 1} available`}</dd>
                  </div>
                </dl>
              </AccordionRow>

              <AccordionRow
                title="Size Chart"
                open={openSection === 'size'}
                onToggle={() => toggleSection('size')}
              >
                <p className="text-xs text-gray-500 mb-3">Approximate vintage measurements. Actual fit may vary.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-black/20">
                        <th className="text-left py-2 pr-3 font-semibold">Size</th>
                        <th className="text-left py-2 pr-3 font-semibold">Chest</th>
                        <th className="text-left py-2 font-semibold">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHART.map((row) => (
                        <tr
                          key={row.size}
                          className={`border-b border-black/10 ${normalizedSize === row.size ? 'font-bold' : ''}`}
                        >
                          <td className="py-2 pr-3">{row.size}</td>
                          <td className="py-2 pr-3">{row.chest}</td>
                          <td className="py-2">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionRow>

              <AccordionRow
                title="Shipping & Returns"
                open={openSection === 'shipping'}
                onToggle={() => toggleSection('shipping')}
              >
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li>{deliveryLabel} delivery across Nepal</li>
                  <li>Rs. 100 within Kathmandu Valley · Rs. 150 outside valley</li>
                  <li>Free shipping on orders over Rs. 5,000</li>
                  <li>All sales final — contact us within 24 hours for damaged items</li>
                </ul>
                <Link to="/shipping" className="inline-block mt-3 text-xs uppercase tracking-wider underline underline-offset-2 hover:no-underline">
                  Full shipping policy
                </Link>
              </AccordionRow>
            </div>
          </div>

          {/* Center — product image */}
          <div className="order-1 lg:order-2 flex flex-col items-center lg:sticky lg:top-24">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-auto block"
              />
              {isSold && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="bg-black text-white px-5 py-2 text-[10px] font-bold tracking-[0.3em] uppercase">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`w-12 h-14 overflow-hidden border transition-all ${
                      selectedImage === index ? 'border-black opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — size & add to cart */}
          <div className="order-3 flex flex-col lg:max-w-[260px] lg:justify-self-start lg:w-full">
            {product.size ? (
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2">Size</p>
                <span className="inline-flex min-w-[2.75rem] h-10 px-4 items-center justify-center text-sm font-black border border-black">
                  {product.size}
                </span>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-3">
                  One of one — this piece is size {product.size}
                </p>
              </div>
            ) : (
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-6">One of one — no size listed</p>
            )}

            {isSold ? (
              <button
                type="button"
                disabled
                className="w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-4 text-[11px] font-bold uppercase tracking-[0.15em] bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  Add to Cart — {formattedPrice}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full mt-3 py-3 text-[10px] font-bold uppercase tracking-[0.2em] border border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Buy It Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Similar listings */}
      {similarProducts.length > 0 && (
        <div className="bg-white border-t border-black/10 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <h2
              className="text-lg font-black uppercase mb-8 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {similarProducts.map((p, index) => (
                <AnimatedProductCard key={p._id} product={p} index={index} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
