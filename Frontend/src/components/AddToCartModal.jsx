import { X, Check, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

function AddToCartModal({ product, quantity, onClose }) {
  const { items } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-black flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs text-white">Added to your cart</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-14 h-14 object-cover border border-gray-100 flex-shrink-0"
          />
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Rs. {(product.price * quantity).toLocaleString()}
              {quantity > 1 && (
                <span className="text-gray-400"> · Qty {quantity}</span>
              )}
            </p>
          </div>
          <Link
            to="/cart"
            onClick={onClose}
            className="flex-shrink-0 flex items-center gap-1 bg-black hover:bg-gray-900 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-3 py-2 transition-colors"
          >
            <ShoppingCart className="w-3 h-3" />
            View Cart
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-2.5 flex justify-between items-center bg-gray-50">
          <span className="text-[11px] text-gray-500">Total</span>
          <span className="text-sm font-bold text-gray-900">Rs. {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default AddToCartModal;
