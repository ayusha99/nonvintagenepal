import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import Article from './pages/Article';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminLayout from './components/AdminLayout';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-black border-t border-gray-900 py-8 mt-auto">
        <div className="w-full px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-[#D4AF37] text-xs font-bold mb-2.5 uppercase tracking-wide">About</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Non Vintage Nepal — Sustainable thrift fashion from Nepal.</p>
            </div>
            <div>
              <h3 className="text-[#D4AF37] text-xs font-bold mb-2.5 uppercase tracking-wide">Shop</h3>
              <ul className="space-y-1.5">
                <li><Link to="/products" className="text-gray-400 hover:text-white text-xs transition">All Products</Link></li>
                <li><Link to="/products?category=tops" className="text-gray-400 hover:text-white text-xs transition">Tops</Link></li>
                <li><Link to="/products?category=bottoms" className="text-gray-400 hover:text-white text-xs transition">Bottoms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#D4AF37] text-xs font-bold mb-2.5 uppercase tracking-wide">Support</h3>
              <ul className="space-y-1.5">
                <li><Link to="/contact" className="text-gray-400 hover:text-white text-xs transition">Contact</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-xs transition">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-xs transition">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#D4AF37] text-xs font-bold mb-2.5 uppercase tracking-wide">Follow</h3>
              <ul className="space-y-1.5">
                <li><a href="#" className="text-gray-400 hover:text-white text-xs transition">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-xs transition">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 mt-6 pt-5 text-center">
            <p className="text-gray-500 text-xs">&copy; 2024 Non Vintage Nepal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes (Customer-facing) */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductList /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/article/:slug" element={<PublicLayout><Article /></PublicLayout>} />
            
            {/* Customer Profile Routes */}
            <Route path="/profile" element={<ProtectedRoute><PublicLayout><Profile /></PublicLayout></ProtectedRoute>} />
            <Route path="/profile/orders" element={<ProtectedRoute><PublicLayout><MyOrders /></PublicLayout></ProtectedRoute>} />
            <Route path="/profile/wishlist" element={<ProtectedRoute><PublicLayout><Wishlist /></PublicLayout></ProtectedRoute>} />
            
            {/* Admin Routes (Uses AdminLayout) */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
