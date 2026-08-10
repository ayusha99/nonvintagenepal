import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    soldProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products
      const productsRes = await api.get('/products?status=available');
      const allProductsRes = await api.get('/products');
      
      const available = productsRes.data.data.length;
      const total = allProductsRes.data.data.length;
      const sold = total - available;

      setStats({
        totalProducts: total,
        availableProducts: available,
        soldProducts: sold,
        totalOrders: 0, // Will implement later
        pendingOrders: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black pt-8">
      <div className="container mx-auto px-6 lg:px-12 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              
              <div className="border border-black p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col h-full justify-between gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Total Inventory
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {stats.totalProducts}
                  </p>
                </div>
              </div>

              <div className="border border-black p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col h-full justify-between gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Available Items
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {stats.availableProducts}
                  </p>
                </div>
              </div>

              <div className="border border-black bg-black text-white p-5">
                <div className="flex flex-col h-full justify-between gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Sold Out
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {stats.soldProducts}
                  </p>
                </div>
              </div>

              <div className="border border-black p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col h-full justify-between gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <Link 
                to="/admin/products" 
                className="group relative border border-black bg-white p-6 hover:bg-black hover:text-white transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-1">
                      Manage Products
                    </h3>
                    <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                      Add, edit, or remove inventory.
                    </p>
                  </div>
                  <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>

              <Link 
                to="/admin/orders" 
                className="group relative border border-black bg-white p-6 hover:bg-black hover:text-white transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-1">
                      Manage Orders
                    </h3>
                    <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                      View and process customer orders.
                    </p>
                  </div>
                  <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
