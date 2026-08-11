import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

function MyOrders() {
  return (
    <div className="max-w-lg mx-auto py-8 px-6">
      <h1 className="text-[11px] font-bold text-gray-900 tracking-widest mb-4 text-center uppercase">My Orders</h1>

      <div className="bg-white border border-gray-100 py-10 px-6 text-center flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
          <ShoppingBag className="w-4 h-4 text-gray-300" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">No orders yet</h3>
        <p className="text-xs text-gray-500 mb-5 max-w-xs leading-relaxed">
          When you purchase items, your order history and tracking details will appear here.
        </p>
        <Link
          to="/products"
          className="bg-black text-[#D4AF37] px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}

export default MyOrders;
