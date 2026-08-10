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
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes (Customer-facing) */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Admin Routes (Hidden - only accessible via direct URL) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <footer className="bg-black border-t border-gray-900 py-12 mt-auto">
              <div className="w-full px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-[#D4AF37] font-bold mb-4 uppercase tracking-wide">About</h3>
                    <p className="text-gray-400 text-sm">Non Vintage Nepal - Sustainable thrift fashion from Nepal.</p>
                  </div>
                  <div>
                    <h3 className="text-[#D4AF37] font-bold mb-4 uppercase tracking-wide">Shop</h3>
                    <ul className="space-y-2">
                      <li><Link to="/products" className="text-gray-400 hover:text-white text-sm transition">All Products</Link></li>
                      <li><Link to="/products?category=tops" className="text-gray-400 hover:text-white text-sm transition">Tops</Link></li>
                      <li><Link to="/products?category=bottoms" className="text-gray-400 hover:text-white text-sm transition">Bottoms</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#D4AF37] font-bold mb-4 uppercase tracking-wide">Support</h3>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Contact</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">FAQ</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Shipping</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#D4AF37] font-bold mb-4 uppercase tracking-wide">Follow</h3>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Instagram</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Facebook</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-900 mt-8 pt-8 text-center">
                  <p className="text-gray-500 text-sm">&copy; 2024 Non Vintage Nepal. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
