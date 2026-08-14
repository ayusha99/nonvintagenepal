import { Link } from 'react-router-dom';
import { Package, CheckCircle, ShoppingBag, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { useAdminStats } from '../../hooks/useAdminStats';
import { AdminBarChart, AdminDonutChart } from '../../components/AdminCharts';

function AdminDashboard() {
  const { stats, categoryStock, loading } = useAdminStats({ pollInterval: 45000 });

  const statCards = [
    {
      title: 'Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      note: 'From live orders',
      icon: DollarSign,
    },
    {
      title: 'Sold',
      value: stats.soldProducts,
      note: 'Out of inventory',
      icon: TrendingUp,
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      note: 'Total in catalog',
      icon: Package,
    },
    {
      title: 'In Stock',
      value: stats.availableProducts,
      note: `${stats.totalStockUnits} units available`,
      icon: CheckCircle,
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      note: `${stats.pendingOrders} pending`,
      icon: ShoppingBag,
    },
  ];

  const inventorySegments = [
    { label: 'In stock', value: stats.availableProducts, color: '#111827' },
    { label: 'Sold', value: stats.soldProducts, color: '#9ca3af' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-7 w-7 border-2 border-gray-200 border-t-black" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl space-y-10">
      <section>
        <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-bold mb-4">Overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 px-5 py-3.5 flex items-center gap-4 min-w-0"
            >
              <div className="shrink-0 w-10 h-10 border border-gray-100 flex items-center justify-center bg-[#f9f9f7]">
                <stat.icon className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-0.5">{stat.title}</p>
                <p
                  className="text-lg xl:text-xl font-black text-black leading-none mb-0.5 truncate"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stat.value}
                </p>
                <p className="text-[9px] text-gray-400 truncate">{stat.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-bold mb-4">Charts</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 p-5 lg:p-6">
            <h3 className="text-xs font-black uppercase text-black mb-1">Stock by category</h3>
            <p className="text-[10px] text-gray-400 mb-5">Units available per category</p>
            <AdminBarChart rows={categoryStock} />
          </div>
          <div className="bg-white border border-gray-200 p-5 lg:p-6">
            <h3 className="text-xs font-black uppercase text-black mb-1">Inventory split</h3>
            <p className="text-[10px] text-gray-400 mb-5">In stock vs sold products</p>
            <AdminDonutChart segments={inventorySegments} />
          </div>
        </div>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-bold mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="group flex items-center justify-between border border-gray-200 bg-white px-5 py-4 hover:border-black transition-colors"
          >
            <div className="flex items-center gap-4">
              <Package className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-black uppercase text-black tracking-wide">Manage Products</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Add or edit inventory</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
          </Link>

          <Link
            to="/admin/orders"
            className="group flex items-center justify-between border border-gray-200 bg-white px-5 py-4 hover:border-black transition-colors"
          >
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-black uppercase text-black tracking-wide">View Orders</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Track customer orders</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
