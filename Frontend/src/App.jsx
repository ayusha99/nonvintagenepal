import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerRoute from './components/CustomerRoute';
import EntryScreen from './components/EntryScreen';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import OrderConfirmed from './pages/OrderConfirmed';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import OurStory from './pages/OurStory';
import Article from './pages/Article';
import FAQ from './pages/FAQ';
import Shipping from './pages/Shipping';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminReports from './pages/Admin/AdminReports';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminDrops from './pages/Admin/AdminDrops';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCustomers from './pages/Admin/AdminCustomers';
import AdminMessages from './pages/Admin/AdminMessages';
import AdminProfile from './pages/Admin/AdminProfile';
import AdminLayout from './components/AdminLayout';
import { BreadcrumbProvider, AutoBreadcrumbs } from './context/BreadcrumbContext';
import { STORE_CATEGORIES } from './constants/categories';

function PublicLayout({ entryDone }) {
  return (
    <CustomerRoute>
    <BreadcrumbProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar transparent={entryDone} />
        <AutoBreadcrumbs />
        <main className="flex-grow">
          {entryDone ? (
            <PageTransition><Outlet /></PageTransition>
          ) : null}
        </main>
        <footer className="bg-[#1f1f1f] border-t border-white/10 mt-auto text-gray-400">
          <div className="w-full px-6 lg:px-12 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div>
                <h3 className="text-white/90 text-[10px] font-black mb-4 uppercase tracking-[0.3em]">About</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Non Vintage Nepal — Sustainable thrift fashion from Kathmandu.
                </p>
                <ul className="space-y-2.5">
                  <li><Link to="/our-story" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">Our Story</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white/90 text-[10px] font-black mb-4 uppercase tracking-[0.3em]">Shop</h3>
                <ul className="space-y-2.5">
                  <li><Link to="/products" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">All Products</Link></li>
                  {STORE_CATEGORIES.slice(0, 4).map((c) => (
                    <li key={c.slug}>
                      <Link to={`/products?category=${c.slug}`} className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-white/90 text-[10px] font-black mb-4 uppercase tracking-[0.3em]">Support</h3>
                <ul className="space-y-2.5">
                  <li><Link to="/contact" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">Contact</Link></li>
                  <li><Link to="/faq" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">FAQ</Link></li>
                  <li><Link to="/shipping" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">Shipping Info</Link></li>
                  <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white/90 text-[10px] font-black mb-4 uppercase tracking-[0.3em]">Follow</h3>
                <ul className="space-y-2.5">
                  <li><a href="https://www.instagram.com/nonvintagenepal?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">Instagram ↗</a></li>
                  <li><a href="https://www.tiktok.com/@nonvintagenepal?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">TikTok ↗</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-[9px] uppercase tracking-[0.3em] font-bold text-center sm:text-left">
                &copy; {new Date().getFullYear()} Non Vintage Nepal. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-[9px] uppercase tracking-[0.3em] font-bold transition-colors">
                  Privacy Policy
                </Link>
                <p className="text-gray-500 text-[9px] uppercase tracking-[0.3em] font-bold">Kathmandu, Nepal</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BreadcrumbProvider>
    </CustomerRoute>
  );
}

function App() {
  const [entryDone, setEntryDone] = useState(
    () => sessionStorage.getItem('nvn_entry_seen') === '1'
  );

  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <EntryScreen onEnter={() => setEntryDone(true)} />
          <Routes>
            <Route element={<PublicLayout entryDone={entryDone} />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmed" element={<ProtectedRoute><OrderConfirmed /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/profile/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            </Route>

            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="drops" element={<AdminDrops />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
