import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Truck, X, Heart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { getDeliveryLabel, SHIPPING_CHARGE, DELIVERY_DAYS } from '../utils/shipping';

function Cart() {
  const { items, removeItem, clearCart, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState(() => new Set(items.map((i) => i._id)));

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i._id)));
  };

  const selectedItems = items.filter((i) => selected.has(i._id));
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = selectedItems.length > 0 ? SHIPPING_CHARGE : 0;
  const total = subtotal + shipping;
  const deliveryLabel = getDeliveryLabel(DELIVERY_DAYS.min, DELIVERY_DAYS.max);

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-sm font-semibold text-gray-900 mb-1">Your cart is empty</h1>
          <p className="text-xs text-gray-500 mb-4">Start shopping to add items</p>
          <Link
            to="/products"
            className="inline-block bg-gray-900 text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[11px] font-bold text-gray-900 tracking-widest uppercase">
            Cart ({items.length})
          </h1>
          <button onClick={clearCart} className="text-[10px] text-gray-400 hover:text-gray-900 transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Items */}
          <div className="md:col-span-3 space-y-2">
            <label className="flex items-center gap-2 text-[10px] text-gray-500 cursor-pointer pb-1">
              <input
                type="checkbox"
                checked={selected.size === items.length}
                onChange={toggleSelectAll}
                className="w-3 h-3"
              />
              Select all
            </label>

            {items.map((item) => {
              const qty = item.quantity || 1;
              const itemTotal = item.price * qty;
              const isSelected = selected.has(item._id);

              return (
                <div
                  key={item._id}
                  className={`border p-3 flex gap-3 ${isSelected ? 'border-gray-300 bg-gray-50/50' : 'border-gray-100'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item._id)}
                    className="mt-1 w-3 h-3 flex-shrink-0"
                  />

                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-14 h-16 object-cover border border-gray-100 flex-shrink-0"
                  />

                  <div className="flex-grow min-w-0">
                    <h3 className="text-xs font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-[11px] font-semibold text-gray-900 mt-0.5">Rs. {item.price.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">In stock</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Truck className="w-2.5 h-2.5" />
                      {deliveryLabel}
                    </p>
                    {item.size && <p className="text-[10px] text-gray-400 mt-0.5">Size: {item.size}</p>}
                    <button
                      onClick={() => user ? navigate('/profile/wishlist') : navigate('/login')}
                      className="text-[10px] text-gray-500 hover:text-gray-900 flex items-center gap-1 mt-1"
                    >
                      <Heart className="w-2.5 h-2.5" /> Save
                    </button>
                  </div>

                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button onClick={() => removeItem(item._id)} className="text-gray-300 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQuantity(item._id, qty - 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-[11px] font-medium">{qty}</span>
                        <button onClick={() => updateQuantity(item._id, qty + 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-semibold text-gray-900">Rs. {itemTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <div className="border border-gray-100 p-4 md:sticky md:top-24">
              <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-3">Summary</h2>

              <div className="space-y-2 mb-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({selectedItems.length})</span>
                  <span className="text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">{shipping > 0 ? `Rs. ${shipping}` : '—'}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900">Total</span>
                  <span className="text-sm font-bold text-gray-900">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { from: 'cart' } })}
                disabled={selectedItems.length === 0}
                className="w-full bg-gray-900 text-white py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-40 mb-2"
              >
                Checkout
              </button>

              <Link to="/products" className="block text-center text-[10px] text-gray-500 hover:text-gray-900 py-1">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
