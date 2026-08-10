import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCartStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = items.length;
  const [searchQuery, setSearchQuery] = useState('');

  const isAdminRoute = location?.pathname?.startsWith('/admin');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Left Side - Logo & Search */}
          <div className="flex items-center gap-8 lg:gap-12">
            <a 
              href="#" 
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <img 
                src="/Non_Vintage_Nepal_Logo_Transparent.png" 
                alt="Non Vintage Nepal" 
                className="h-14 w-auto"
              />
            </a>

            {/* Search Bar */}
            {!isAdminRoute && (
              <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="w-72 lg:w-96 xl:w-[450px] pl-4 pr-10 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-900 bg-gray-50/50 text-sm transition-all duration-300"
                />
                <button type="submit" className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Right Side - Links & Utilities */}
          <div className="flex items-center space-x-6 md:space-x-12">
            {!isAdminRoute && (
              <>
                {/* Main Links */}
                <div className="hidden md:flex items-center space-x-6 md:space-x-12">
                  <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-xs uppercase tracking-widest font-bold">
                    Feed
                  </Link>
                  <Link to="/products" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-xs uppercase tracking-widest font-bold">
                    Shop
                  </Link>
                </div>
                
                <Link to="/cart" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-xs uppercase tracking-widest font-bold relative mr-2 md:mr-4">
                  Bag
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-gray-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            {/* Login and Signup buttons */}
            <div className="hidden md:flex items-center space-x-8 md:space-x-12">
              {!user ? (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-xs uppercase tracking-widest font-bold">
                    Login
                  </Link>
                  <Link to="/signup" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-xs uppercase tracking-widest font-bold">
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="text-gray-900 hover:text-gray-700 transition-colors duration-200 text-xs uppercase tracking-widest font-bold">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 text-xs uppercase tracking-widest font-bold transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 hover:text-gray-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
