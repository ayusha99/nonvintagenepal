import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCartStore } from '../store/cartStore';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

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

  const handleAddToCart = () => {
    if (product && product.status === 'available') {
      addItem(product);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 uppercase tracking-wider text-sm font-bold">Product not found</p>
      </div>
    );
  }

  const isSold = product.status === 'sold';

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Breadcrumbs - matching Grailed style */}
      <div className="border-b border-gray-200 py-3 px-6 lg:px-12 text-[11px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
        <span className="hover:underline cursor-pointer">Shop</span> &gt;
        <span className="hover:underline cursor-pointer">{product.category}</span> &gt;
        <span className="text-gray-900 truncate">{product.name}</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery Area */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 lg:w-[55%]">
            {/* Thumbnails (Vertical on desktop, Horizontal on mobile) */}
            {product.images.length > 1 && (
              <div className="flex lg:flex-col gap-2 overflow-auto no-scrollbar lg:w-20 lg:flex-shrink-0">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-50 flex-shrink-0 overflow-hidden transition-all ${
                      selectedImage === index ? 'opacity-100 border-2 border-black' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative w-full aspect-[4/5] bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Image Navigation Arrows (simulated) */}
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}

              {isSold && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-black text-white px-8 py-3 text-sm font-bold tracking-widest uppercase">
                    SOLD
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:w-[45%] flex flex-col lg:pl-4 pt-2">
            {/* Header Info */}
            <div className="mb-6">
              {product.brand && (
                <h2 className="text-[15px] font-bold uppercase tracking-tight hover:underline cursor-pointer mb-1 inline-block">
                  {product.brand}
                </h2>
              )}
              <h1 className="text-sm text-gray-700 leading-snug mb-3">
                {product.name}
              </h1>
              <div className="text-[12px] text-gray-500 font-semibold tracking-wide flex items-center gap-1.5">
                <span>{product.size || 'Regular Size'}</span>
                <span>/</span>
                <span>{product.condition || 'Used'}</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6 flex items-end gap-3">
              <span className="text-2xl font-bold tracking-tight text-[#ff3c3c]">
                Rs{product.price.toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={isSold}
                className={`w-full py-3.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                  isSold
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isSold ? 'Sold Out' : 'Purchase'}
              </button>
              
              <button disabled className="w-full py-3.5 text-xs font-bold uppercase tracking-widest border border-black text-black hover:bg-gray-50 transition-colors">
                Offer
              </button>
              
              <button disabled className="w-full py-3.5 text-xs font-bold uppercase tracking-widest border border-black text-black hover:bg-gray-50 transition-colors">
                Message
              </button>
            </div>

            {/* Description Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-[15px] font-bold mb-4">Seller Description</h3>
              <div className="text-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                {product.description}
              </div>
              
              <div className="flex flex-col gap-1.5 text-[13px]">
                {product.brand && (
                  <div className="flex">
                    <span className="text-gray-500 w-28">Brand:</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex">
                    <span className="text-gray-500 w-28">Department:</span>
                    <span className="font-medium capitalize">{product.category}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex">
                    <span className="text-gray-500 w-28">Size:</span>
                    <span className="font-medium">{product.size}</span>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
