import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
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
    <div className="bg-white">

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 xl:px-16 pt-5 pb-12">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">
            My wishlist
            {!loading && (
              <span className="text-base font-normal text-gray-500 ml-3">
                ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900" />
          </div>
        ) : wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 lg:py-14">
            <div className="w-16 h-16 bg-gray-50 border border-gray-200 flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-gray-300" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
              Save your favorite vintage pieces here before they're gone.
            </p>
            <Link
              to="/products"
              className="inline-block bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-black transition-colors"
            >
              Explore collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
