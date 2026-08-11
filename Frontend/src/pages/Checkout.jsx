import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { MapPin, Info, Truck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { SHIPPING_CHARGE, getDeliveryLabel, DELIVERY_DAYS } from '../utils/shipping';

function Checkout() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutState = location.state;
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const total = subtotal + SHIPPING_CHARGE;
  const deliveryLabel = getDeliveryLabel(DELIVERY_DAYS.min, DELIVERY_DAYS.max);
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Order placed successfully! (Demo)');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const hasAddress = formData.name && formData.phone && formData.address && formData.city;
  const fromProduct = checkoutState?.from === 'product' && checkoutState?.product;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-8 pb-10">
          <nav className="text-xs text-gray-400 flex flex-wrap items-center gap-2 mb-8">
            {fromProduct ? (
              <>
                <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                <span className="text-gray-300">/</span>
                <Link to="/products" className="hover:text-gray-900 transition-colors">Shop</Link>
                <span className="text-gray-300">/</span>
                <Link
                  to={`/products?category=${checkoutState.product.category}`}
                  className="hover:text-gray-900 capitalize transition-colors"
                >
                  {checkoutState.product.category}
                </Link>
                <span className="text-gray-300">/</span>
                <Link
                  to={`/products/${checkoutState.product.id}`}
                  className="hover:text-gray-900 transition-colors truncate max-w-[160px] sm:max-w-none"
                >
                  {checkoutState.product.name}
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-700">Checkout</span>
              </>
            ) : (
              <>
                <Link to="/cart" className="hover:text-gray-900 transition-colors">Cart</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-700">Checkout</span>
              </>
            )}
          </nav>
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">Checkout</h1>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20">

            {/* Left — Delivery & Payment */}
            <div className="lg:col-span-7 space-y-16 lg:space-y-20">

              {/* Delivery */}
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-8">Delivery</h2>

                {!showAddressForm && !hasAddress ? (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg py-10 flex flex-col items-center justify-center gap-2 text-gray-600 hover:border-gray-400 hover:bg-white transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">Add delivery address</span>
                    <span className="text-xs text-gray-400">Required to place your order</span>
                  </button>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 space-y-6">
                    {!showAddressForm && hasAddress && (
                      <div className="flex items-start justify-between pb-6 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{formData.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{formData.phone}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{formData.address}, {formData.city}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(true)}
                          className="text-sm text-gray-600 hover:text-gray-900 underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}

                    {(showAddressForm || !hasAddress) && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">Full name</label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-white border border-gray-300 rounded-md text-sm text-gray-900 px-4 py-3 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">Phone</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-white border border-gray-300 rounded-md text-sm text-gray-900 px-4 py-3 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-md text-sm text-gray-900 px-4 py-3 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="Street address, area"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">City</label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full bg-white border border-gray-300 rounded-md text-sm text-gray-900 px-4 py-3 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">Postal code <span className="text-gray-400 font-normal">(optional)</span></label>
                            <input
                              type="text"
                              value={formData.postalCode}
                              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                              className="w-full bg-white border border-gray-300 rounded-md text-sm text-gray-900 px-4 py-3 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                        {hasAddress && (
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="text-sm font-medium text-gray-900 hover:underline"
                          >
                            Save address
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 text-sm text-gray-500">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <span>{deliveryLabel} · Rs. {SHIPPING_CHARGE} standard shipping</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-8">Payment</h2>

                <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 space-y-5">
                  <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-md">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900 leading-relaxed">
                      eSewa online payment is coming soon. Cash on Delivery is available for all orders in Nepal.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 rounded-md border-2 cursor-pointer transition-colors ${
                        formData.paymentMethod === 'cod'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500 mt-0.5">Pay when your order arrives</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 rounded-md border border-gray-200 cursor-not-allowed opacity-50">
                      <input type="radio" disabled className="w-4 h-4" />
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-500">eSewa</p>
                        <p className="text-xs text-gray-400 mt-0.5">Coming soon</p>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            </div>

            {/* Right — Order summary (sticky) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 bg-white border border-gray-200 rounded-lg p-6 lg:p-8 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-6">
                  Order summary
                  <span className="text-sm font-normal text-gray-500 ml-2">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                </h2>

                {/* Items */}
                <div className="space-y-5 mb-8 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border border-gray-100"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                          {item.quantity || 1}
                        </span>
                      </div>
                      <div className="flex-grow min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        {item.size && (
                          <p className="text-xs text-gray-500 mt-1">Size {item.size}</p>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                        Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 py-6 border-t border-gray-100 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Rs. {SHIPPING_CHARGE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Estimated delivery</span>
                    <span className="text-gray-500">{deliveryLabel.replace('Delivery by ', '')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-6 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">Rs. {total.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-4 rounded-md text-sm font-semibold hover:bg-black transition-colors"
                >
                  Place order
                </button>

                <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
                  By placing your order, you agree to our return policy. Secure checkout.
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
