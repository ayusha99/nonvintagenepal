import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useState, useRef, useEffect } from 'react';
import { User, Package, Heart, Mail, LogOut, ChevronDown, Menu, X } from 'lucide-react';

function Navbar({ transparent = false }) {
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = items.length;
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const isAdminRoute = location?.pathname?.startsWith('/admin');
  const isHome = location.pathname === '/';
  const overlayMode = transparent && isHome && !scrolled && !isAdminRoute;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    if (isAdmin) navigate('/admin');
    else navigate('/');
  };

  const linkClass = overlayMode
    ? 'text-white/80 hover:text-white'
    : 'text-gray-600 hover:text-black';

  const logoFilter = overlayMode ? 'brightness-0 invert' : '';

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          overlayMode
            ? 'bg-transparent border-transparent'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-8 lg:gap-12">
              <a href="#" onClick={handleLogoClick} className="cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src="/Non_Vintage_Nepal_Logo_Transparent.png"
                  alt="Non Vintage Nepal"
                  className={`h-10 lg:h-12 w-auto transition-all duration-500 ${logoFilter}`}
                />
              </a>

              {!isAdminRoute && (
                <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search archive..."
                    className={`w-64 xl:w-80 pl-4 pr-10 py-2 text-sm outline-none transition-all duration-300 rounded-none border ${
                      overlayMode
                        ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-white/60'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900'
                    }`}
                  />
                  <button type="submit" className={`absolute right-0 top-1/2 -translate-y-1/2 p-3 transition-colors ${overlayMode ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              )}
            </div>

            {/* Desktop nav */}
            <div className="flex items-center gap-6 lg:gap-10">
              {!isAdminRoute && (
                <>
                  <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={`text-[10px] uppercase tracking-[0.25em] font-black transition-colors duration-300 ${linkClass}`}>
                      Feed
                    </Link>
                    <Link to="/products" className={`text-[10px] uppercase tracking-[0.25em] font-black transition-colors duration-300 ${linkClass}`}>
                      Shop
                    </Link>
                  </div>

                  <Link to="/cart" className={`text-[10px] uppercase tracking-[0.25em] font-black transition-colors duration-300 relative ${linkClass}`}>
                    Bag
                    {cartCount > 0 && (
                      <span className={`absolute -top-2.5 -right-4 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black ${overlayMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <div className="hidden md:flex items-center gap-6">
                {!user ? (
                  <>
                    <Link to="/login" className={`text-[10px] uppercase tracking-[0.25em] font-black transition-colors duration-300 ${linkClass}`}>
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className={`text-[10px] uppercase tracking-[0.25em] font-black px-4 py-2 transition-all duration-300 ${
                        overlayMode
                          ? 'bg-white text-black hover:bg-white/90'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      Signup
                    </Link>
                  </>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center gap-2 transition-colors duration-300 ${linkClass}`}
                    >
                      <div className={`w-7 h-7 flex items-center justify-center overflow-hidden font-bold rounded-full ${overlayMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 shadow-2xl py-1 z-50">
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                            <User className="w-3.5 h-3.5" /> Admin
                          </Link>
                        )}
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                          <User className="w-3.5 h-3.5" /> Account
                        </Link>
                        <Link to="/profile/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                          <Package className="w-3.5 h-3.5" /> Orders
                        </Link>
                        <Link to="/profile/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                          <Heart className="w-3.5 h-3.5" /> Wishlist
                        </Link>
                        <Link to="/contact" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                          <Mail className="w-3.5 h-3.5" /> Contact
                        </Link>
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          onClick={() => { setDropdownOpen(false); handleLogout(); }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              {!isAdminRoute && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className={`md:hidden transition-colors ${overlayMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && !isAdminRoute && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Menu</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex flex-col px-6 py-6 gap-1 flex-1">
              {['/', '/products', '/cart', '/contact'].map((path) => (
                <Link
                  key={path}
                  to={path}
                  className="py-3.5 text-sm font-black uppercase tracking-[0.2em] text-gray-800 hover:text-black border-b border-gray-50 transition-colors"
                >
                  {path === '/' ? 'Feed' : path === '/products' ? 'Shop' : path === '/cart' ? 'Bag' : 'Contact'}
                </Link>
              ))}
            </nav>
            <div className="px-6 py-6 border-t border-gray-100">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="w-full py-3 text-center text-[10px] font-black uppercase tracking-widest border border-gray-200">Login</Link>
                  <Link to="/signup" className="w-full py-3 text-center text-[10px] font-black uppercase tracking-widest bg-black text-white">Signup</Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-100">Log Out</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
