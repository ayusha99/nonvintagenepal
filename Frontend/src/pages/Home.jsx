import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero images - Real Non Vintage Nepal Instagram products
  const heroImages = [
    "https://i.pinimg.com/originals/12/7b/41/127b41ae854386752953e466f23b4de4.jpg",
    "https://i.pinimg.com/originals/36/8c/26/368c261d76bcfa5add0ffe3e062dfd20.jpg",
    "https://i.pinimg.com/originals/05/31/6c/05316c5942a7498ca22c756da0ce1005.jpg",
  ];

  const categories = [
    { name: 'Tops', path: '/products?search=tops' },
    { name: 'Bottoms', path: '/products?search=bottoms' },
    { name: 'Outerwear', path: '/products?search=outerwear' },
    { name: 'Accessories', path: '/products?search=accessories' },
    { name: 'Shoes', path: '/products?search=shoes' },
    { name: 'Vintage', path: '/products?search=vintage' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?status=available');
        setFeaturedProducts(response.data.data.slice(0, 16));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Rotating images animation
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  const newArrivals = featuredProducts.slice(0, 8);
  const staffPicks = featuredProducts.slice(8, 16);

  return (
    <div className="min-h-screen bg-white">
      {/* Category Sub-Nav */}
      <div className="border-b border-gray-200 bg-white sticky top-[96px] z-40 hidden md:block">
        <div className="w-full px-6 lg:px-12">
          <ul className="flex items-center justify-center space-x-12 lg:space-x-20 h-14 overflow-x-auto no-scrollbar">
            {categories.map((cat, idx) => (
              <li key={idx}>
                <Link to={cat.path} className="text-gray-900 hover:text-gray-600 text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full relative h-[350px] md:h-[450px] lg:h-[500px] bg-black flex items-center justify-center overflow-hidden group">
        {heroImages.map((image, index) => (
          <img 
            key={index}
            src={image} 
            alt={`Vintage Collection ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover object-[50%_30%] transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-4xl flex flex-col items-center">
          <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3">
            Editorial
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight tracking-wide">
            Non Vintage Collection
          </h1>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/products" 
              className="inline-block bg-white border border-white text-black px-8 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors"
            >
              Shop All
            </Link>
            <Link 
              to="/products?search=new" 
              className="inline-block bg-transparent border border-white text-white px-8 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="w-full px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight text-gray-900">
              New Arrivals
            </h2>
          </div>
          <Link to="/products" className="hidden md:inline-block text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:text-gray-600 transition-colors">
            Shop All
          </Link>
        </div>

        {loading ? (
           <div className="text-center py-20">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
           </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 border border-gray-200">
             <p className="uppercase tracking-widest text-sm text-gray-500 font-bold">Collection Coming Soon</p>
          </div>
        )}
      </section>

      {/* Editorial Banner */}
      <section className="w-full px-6 lg:px-12 py-10">
        <div className="bg-gray-50 flex flex-col md:flex-row items-stretch border border-gray-200">
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-gray-900 mb-4 leading-none">
              100% Unique &<br/>Sustainable
            </h3>
            <p className="text-gray-600 text-[13px] leading-relaxed mb-8 max-w-sm font-medium">
              Based in Kathmandu. Every piece in our collection is hand-picked, authenticated, and one-of-a-kind. Embrace circular fashion. Once it's gone, it's gone forever.
            </p>
            <Link to="/products" className="self-start border-b-2 border-gray-900 text-gray-900 font-bold uppercase tracking-widest text-[11px] pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
              Read Our Story
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-[400px] md:h-[500px]">
             <img src={heroImages[1]} className="w-full h-full object-cover" alt="Editorial" />
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="w-full px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight text-gray-900">
              Trending Now
            </h2>
          </div>
          <Link to="/products" className="hidden md:inline-block text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:text-gray-600 transition-colors">
            View All
          </Link>
        </div>

        {loading ? (
           <div className="text-center py-20">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
           </div>
        ) : staffPicks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {staffPicks.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 border border-gray-200">
             <p className="uppercase tracking-widest text-sm text-gray-500 font-bold">More Items Coming Soon</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
