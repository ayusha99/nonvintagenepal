import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import AnimatedProductCard from '../components/AnimatedProductCard';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import api from '../api/axios';

import { PRODUCT_LIST_CATEGORIES as categories } from '../constants/categories';
import { useDrops } from '../hooks/useDrops';

const conditions = [
  { value: '', label: 'All conditions' },
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like new' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
];

const inputClass =
  'w-full bg-[#f9f9f7] border border-gray-200 text-gray-900 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-400';

const labelClass =
  'block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2';

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-1">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const searchParam = params.get('search') || '';
  const categoryParam = params.get('category') || '';
  const dropParam = params.get('drop') || '';
  const [searchQuery, setSearchQuery] = useState(searchParam);

  const { drops } = useDrops();

  const activeCategory = categories.find((c) => c.value === categoryParam);
  const activeDrop = drops.find((d) => d.slug === dropParam || d.id === dropParam);
  const pageTitle = searchParam
    ? `"${searchParam}"`
    : activeDrop
      ? activeDrop.title
      : activeCategory && activeCategory.value
        ? activeCategory.label
        : 'All Products';

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, selectedCondition, location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiParams = { status: 'available' };
      if (categoryParam) apiParams.category = categoryParam;
      if (dropParam) apiParams.drop = dropParam;
      if (selectedCondition) apiParams.condition = selectedCondition;

      const response = await api.get('/products', { params: apiParams });
      let filtered = response.data.data;

      if (searchParam) {
        const q = searchParam.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q)
        );
      }

      if (priceRange.min || priceRange.max) {
        filtered = filtered.filter((p) => {
          const min = priceRange.min ? parseFloat(priceRange.min) : 0;
          const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
          return p.price >= min && p.price <= max;
        });
      }

      setProducts(filtered);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, sortBy]);

  const setCategory = (value) => {
    const next = new URLSearchParams(location.search);
    if (value) next.set('category', value);
    else next.delete('category');
    navigate(`/products?${next.toString()}`);
  };

  const handleSearch = () => {
    const next = new URLSearchParams(location.search);
    if (searchQuery.trim()) next.set('search', searchQuery.trim());
    else next.delete('search');
    navigate(`/products?${next.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCondition('');
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    navigate('/products');
  };

  const applyPriceFilter = () => {
    fetchProducts();
    setShowFilters(false);
  };

  const activeFilterCount =
    (categoryParam ? 1 : 0) +
    (selectedCondition ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (searchParam ? 1 : 0);

  const filterKey = `${categoryParam}-${selectedCondition}-${location.search}-${priceRange.min}-${priceRange.max}-${sortBy}`;
  const { visibleProducts, hasMore, sentinelRef, visibleCount, totalCount } = useInfiniteProducts(
    sortedProducts,
    filterKey
  );

  const filterPanel = (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search archive..."
          className={`${inputClass} pl-9`}
        />
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <select
          value={categoryParam}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Condition</label>
        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className={inputClass}
        >
          {conditions.map((cond) => (
            <option key={cond.value} value={cond.value}>{cond.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Price (NPR)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <button
        onClick={applyPriceFilter}
        className="w-full bg-black text-white py-3 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors"
      >
        Apply
      </button>
    </div>
  );

  return (
    <div className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-16">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-5 border-b border-gray-100">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-1 font-bold">Archive</p>
            <h1
              className="text-2xl md:text-3xl font-black uppercase text-black"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
            >
              {pageTitle}
            </h1>
            {!loading && (
              <p className="text-sm text-gray-500 mt-1">
                {totalCount} {totalCount === 1 ? 'piece' : 'pieces'}
                {visibleCount < totalCount && ` · showing ${visibleCount}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-[#f9f9f7] border border-gray-200 text-[10px] uppercase tracking-wider font-bold text-gray-600 focus:outline-none focus:border-black appearance-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-gray-600 hover:border-black transition-colors"
            >
              {showFilters ? <X className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
              Filter{activeFilterCount > 0 && ` (${activeFilterCount})`}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categoryParam && (
              <span className="inline-flex items-center gap-1.5 bg-[#f9f9f7] border border-gray-200 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-600">
                {activeCategory?.label}
                <button onClick={() => setCategory('')} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchParam && (
              <span className="inline-flex items-center gap-1.5 bg-[#f9f9f7] border border-gray-200 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-600">
                Search: {searchParam}
                <button onClick={() => { setSearchQuery(''); navigate(categoryParam ? `/products?category=${categoryParam}` : '/products'); }} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCondition && (
              <span className="inline-flex items-center gap-1.5 bg-[#f9f9f7] border border-gray-200 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-600">
                {conditions.find((c) => c.value === selectedCondition)?.label}
                <button onClick={() => setSelectedCondition('')} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center gap-1.5 bg-[#f9f9f7] border border-gray-200 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-600">
                Rs. {priceRange.min || '0'} – {priceRange.max || '∞'}
                <button onClick={() => { setPriceRange({ min: '', max: '' }); fetchProducts(); }} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar filters — desktop + mobile drawer */}
          <aside className={`lg:w-52 xl:w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-28 border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-black">Filters</p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-black transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              {filterPanel}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <SkeletonGrid />
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-1">
                  {visibleProducts.map((product, index) => (
                    <AnimatedProductCard key={product._id} product={product} index={index} />
                  ))}
                </div>

                {hasMore && (
                  <div ref={sentinelRef} className="flex flex-col items-center justify-center py-14">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-black mb-3" />
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Loading more</p>
                  </div>
                )}

                {!hasMore && totalCount > 8 && (
                  <p className="text-center text-[10px] uppercase tracking-wider text-gray-400 font-bold py-10">
                    All {totalCount} pieces loaded
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-20 border border-gray-100 bg-[#f9f9f7]">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2 font-bold">Nothing found</p>
                <h2
                  className="text-xl font-black uppercase text-black mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  No Products
                </h2>
                <p className="text-sm text-gray-500 mb-6">Try a different category or clear your filters.</p>
                <button
                  onClick={clearFilters}
                  className="inline-block bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
