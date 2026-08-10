import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const categories = [
  { value: '', label: 'All' },
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'other', label: 'Other' },
];

const conditions = [
  { value: '', label: 'All Conditions' },
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search !== null) {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedCondition, location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { status: 'available' };
      if (selectedCategory) params.category = selectedCategory;
      if (selectedCondition) params.condition = selectedCondition;

      const response = await api.get('/products', { params });
      let filteredProducts = response.data.data;

      const currentParams = new URLSearchParams(location.search);
      const activeSearchQuery = currentParams.get('search') || '';

      if (activeSearchQuery) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(activeSearchQuery.toLowerCase())
        );
      }

      if (priceRange.min || priceRange.max) {
        filteredProducts = filteredProducts.filter(p => {
          const price = p.price;
          const min = priceRange.min ? parseFloat(priceRange.min) : 0;
          const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
          return price >= min && price <= max;
        });
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('?');
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCondition('');
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    navigate('?');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-6 lg:px-12 pt-4 lg:pt-6 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Shop</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">Shop All Products</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar (Search + Filters) */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-28">
              
              {/* Search Bar inside Sidebar */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search products"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-md pl-10 pr-4 py-2.5 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 font-semibold text-sm">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-900 text-xs transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 px-3 py-2 text-sm rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                  >
                    {categories.map((cat) => (
                       <option key={cat.value} value={cat.value}>
                         {cat.label}
                       </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-2">Condition</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 px-3 py-2 text-sm rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                  >
                    {conditions.map((cond) => (
                       <option key={cond.value} value={cond.value}>
                         {cond.label}
                       </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-2">Price Range (NPR)</label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-1/2 bg-white border border-gray-200 text-gray-900 px-3 py-2 text-sm rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-1/2 bg-white border border-gray-200 text-gray-900 px-3 py-2 text-sm rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full bg-gray-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-black transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3 -mt-1.5">
                  <h2 className="text-gray-600 text-sm leading-none">
                    {products.length} {products.length === 1 ? 'Product' : 'Products'}
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-gray-600">No items found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
