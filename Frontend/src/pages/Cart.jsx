import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Truck, X, Heart, ArrowRight } from 'lucide-react';
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
      <div className="bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2 font-bold">Your Bag</p>
          <h1
            className="text-2xl md:text-3xl font-black uppercase text-black mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
          >
            Empty
          </h1>
          <p className="text-sm text-gray-500 mb-8">Start shopping to add items to your bag.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors"
          >
            Browse Archive <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-5 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10 pb-4 border-b border-gray-100">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-1 font-bold">Checkout</p>
            <h1
              className="text-2xl md:text-3xl font-black uppercase text-black"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
            >
              Your Bag
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black font-bold transition-colors self-start sm:self-auto"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Items */}
          <div className="lg:col-span-8">
            <label className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={selected.size === items.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-black"
              />
              Select all
            </label>

            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const qty = item.quantity || 1;
                const itemTotal = item.price * qty;
                const isSelected = selected.has(item._id);
                const maxStock = item.stock ?? 1;

                return (
                  <div
                    key={item._id}
                    className={`flex gap-5 lg:gap-8 py-6 first:pt-0 transition-colors ${
                      isSelected ? 'bg-[#f9f9f7] -mx-4 px-4 lg:-mx-6 lg:px-6' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item._id)}
                      className="mt-4 w-4 h-4 flex-shrink-0 accent-black"
                    />

                    <Link to={`/products/${item._id}`} className="flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-24 h-32 lg:w-28 lg:h-36 object-cover bg-gray-100"
                      />
                    </Link>

                    <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <Link to={`/products/${item._id}`}>
                          <h3 className="text-sm font-black uppercase text-black hover:opacity-70 transition-opacity line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm font-black text-black mt-1.5">Rs. {item.price.toLocaleString()}</p>
                        <p className={`text-[10px] uppercase tracking-wider font-bold mt-2 ${maxStock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                          {maxStock > 0 ? 'In stock' : 'Out of stock'}
                        </p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-1.5 uppercase tracking-wider">
                          <Truck className="w-3 h-3" />
                          {deliveryLabel}
                        </p>
                        {item.size && (
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Size: {item.size}</p>
                        )}
                      </div>
                      <button
                        onClick={() => (user ? navigate('/profile/wishlist') : navigate('/login'))}
                        className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-black flex items-center gap-1.5 mt-4 self-start font-bold transition-colors"
                      >
                        <Heart className="w-3 h-3" /> Save for later
                      </button>
                    </div>

                    <div className="flex flex-col items-end justify-between flex-shrink-0 min-h-[128px] py-1">
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-300 hover:text-black p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item._id, qty - 1)}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#f9f9f7] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold">{qty}</span>
                          <button
                            onClick={() => updateQuantity(item._id, qty + 1)}
                            disabled={qty >= maxStock}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#f9f9f7] transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-black">Rs. {itemTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 border border-gray-100 bg-[#f9f9f7] p-8">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-1 font-bold">Summary</p>
              <h2
                className="text-lg font-black uppercase text-black mb-8"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Order Total
              </h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">
                    Subtotal ({selectedItems.length})
                  </span>
                  <span className="text-black font-black">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Shipping</span>
                  <span className="text-black font-black">
                    {shipping > 0 ? `Rs. ${shipping.toLocaleString()}` : '—'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-500">Total</span>
                  <span className="text-xl font-black text-black">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate('/checkout', {
                    state: { from: 'cart', selectedIds: selectedItems.map((i) => i._id) },
                  })
                }
                disabled={selectedItems.length === 0}
                className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors disabled:opacity-40 mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black font-bold py-2 transition-colors"
              >
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
