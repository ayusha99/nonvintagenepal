import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

function MyOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlacedBanner, setShowPlacedBanner] = useState(location.state?.orderPlaced === true);

  useEffect(() => {
    api.get('/orders/my')
      .then((res) => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!location.state?.orderPlaced) return;
    window.history.replaceState({}, document.title);
  }, [location.state]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-8 pb-16">
        <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-1 font-bold">Account</p>
        <h1
          className="text-2xl font-black uppercase text-black mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          My Orders
        </h1>

        {showPlacedBanner && (
          <div className="flex items-start gap-3 border border-green-200 bg-green-50 p-4 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-bold text-green-900">Order placed successfully</p>
              <p className="text-xs text-green-700 mt-0.5">Your latest order appears below.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPlacedBanner(false)}
              className="text-[10px] uppercase tracking-wider font-bold text-green-700 hover:text-green-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-6 w-6 border-2 border-gray-200 border-t-black rounded-full" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <p className="text-xs font-black text-black">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">Rs. {order.totalAmount?.toLocaleString()}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-0.5 capitalize">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.product?.images?.[0] && (
                        <img src={item.product.images[0]} alt="" className="w-10 h-12 object-cover bg-gray-100" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-black">{item.product?.name || 'Product'}</p>
                        <p className="text-[10px] text-gray-400">Qty {item.quantity || 1} · Rs. {item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-gray-100 bg-[#f9f9f7]">
            <Package className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-black mb-1">No orders yet</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-6">Start shopping to place your first order</p>
            <Link
              to="/products"
              className="inline-block bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors"
            >
              Browse Archive
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
