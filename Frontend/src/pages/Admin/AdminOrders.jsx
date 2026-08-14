import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import api from '../../api/axios';

const ORDER_STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];

const labelClass = 'text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold';
const selectClass = 'bg-[#f9f9f7] border border-gray-200 text-[10px] uppercase tracking-wider font-bold px-2 py-1 focus:outline-none focus:border-black';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => o.orderStatus === statusFilter);
  }, [orders, statusFilter]);

  const updateStatus = async (id, field, value) => {
    try {
      const res = await api.put(`/orders/${id}`, { [field]: value });
      setOrders((prev) => prev.map((o) => (o._id === id ? res.data.data : o)));
    } catch {
      setError('Failed to update order');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className={labelClass}>{orders.length} total orders</p>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>}

      <div className="border border-gray-200 bg-white">
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-gray-200 border-t-black rounded-full" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-[#f9f9f7]">
                  {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-[#f9f9f7]/50">
                    <td className="px-4 py-3">
                      <p className="text-xs font-black text-black">#{order._id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-black">{order.shippingAddress?.name}</p>
                      <p className="text-[10px] text-gray-400">{order.shippingAddress?.phone}</p>
                      <p className="text-[10px] text-gray-400">{order.user?.email || 'Guest'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {order.items?.map((item, i) => (
                          <p key={i} className="text-[10px] text-gray-600">
                            {item.product?.name || 'Product'} × {item.quantity || 1}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-black">Rs. {order.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updateStatus(order._id, 'paymentStatus', e.target.value)}
                        className={selectClass}
                      >
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase">{order.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, 'orderStatus', e.target.value)}
                        className={selectClass}
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-gray-400">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 mb-1">No orders yet</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Orders will appear here after checkout</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
