import { useState, useEffect } from 'react';
import { HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/user/wishlist');
      setWishlist(response.data.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 lg:px-12">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[11px] font-bold text-gray-900 tracking-widest uppercase">My Wishlist</h1>
        <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 text-[10px] font-semibold">
          {wishlist.length} Items
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-gray-900" />
        </div>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 py-10 px-6 text-center flex flex-col items-center max-w-lg mx-auto">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <HeartOff className="w-4 h-4 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500 mb-5 max-w-xs leading-relaxed">
            Save your favorite vintage pieces here before they're gone.
          </p>
          <Link
            to="/products"
            className="bg-black text-[#D4AF37] px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
