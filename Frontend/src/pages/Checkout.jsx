import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Truck, Banknote, Wallet } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { SHIPPING_CHARGE, getDeliveryLabel, DELIVERY_DAYS } from '../utils/shipping';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Checkout() {
  const { items, removeItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutState = location.state;
  const { setBreadcrumbs } = useBreadcrumbs();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });

  const fromProduct = checkoutState?.from === 'product' && checkoutState?.product;
  const fromCart = checkoutState?.from === 'cart';
  const selectedIds = checkoutState?.selectedIds;

  const checkoutItems = useMemo(() => {
    if (fromCart && Array.isArray(selectedIds) && selectedIds.length > 0) {
      return items.filter((item) => selectedIds.includes(item._id));
    }
    return items;
  }, [items, fromCart, selectedIds]);

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const total = subtotal + (checkoutItems.length > 0 ? SHIPPING_CHARGE : 0);
  const deliveryLabel = getDeliveryLabel(DELIVERY_DAYS.min, DELIVERY_DAYS.max);
  const itemCount = checkoutItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const hasAddress = formData.name && formData.phone && formData.address && formData.city;

  useEffect(() => {
    if (checkoutItems.length === 0) return;
    if (fromProduct) {
      setBreadcrumbs([
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/products' },
        {
          label: checkoutState.product.category,
          to: `/products?category=${checkoutState.product.category}`,
          capitalize: true,
        },
        {
          label: checkoutState.product.name,
          to: `/products/${checkoutState.product.id}`,
          truncate: true,
        },
        { label: 'Checkout' },
      ]);
    } else {
      setBreadcrumbs([
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/products' },
        { label: 'Bag', to: '/cart' },
        { label: 'Checkout' },
      ]);
    }
  }, [checkoutItems.length, fromProduct, checkoutState, setBreadcrumbs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasAddress) {
      setShowAddressForm(true);
      return;
    }
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        items: checkoutItems.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity || 1,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: total,
      });
      removeItems(checkoutItems.map((item) => item._id));
      navigate('/order-confirmed', {
        replace: true,
        state: {
          confirmation: {
            orderId: res.data.data._id,
            totalAmount: total,
            items: checkoutItems,
            paymentMethod: formData.paymentMethod,
          },
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkoutItems.length === 0) {
    navigate('/cart');
    return null;
  }


  const inputClass =
    'w-full bg-white border border-gray-300 text-sm text-gray-900 px-4 py-3 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900';

  return (
    <div className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 xl:px-16 pt-5 pb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20">

            {/* Left */}
            <div className="lg:col-span-8 space-y-8">

              {/* Delivery */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">Delivery address</h2>
                  {hasAddress && !showAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 bg-gray-50 p-6 lg:p-7">
                  {!showAddressForm && hasAddress ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{formData.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{formData.phone}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{formData.address}, {formData.city}</p>
                      {formData.postalCode && (
                        <p className="text-sm text-gray-500 mt-0.5">{formData.postalCode}</p>
                      )}
                    </div>
                  ) : !showAddressForm ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">No address saved yet</p>
                          <p className="text-xs text-gray-500 mt-1">Add where you want your order delivered</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(true)}
                        className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-black transition-colors sm:flex-shrink-0"
                      >
                        Add address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Full name</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Street address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className={inputClass}
                          placeholder="Area, street, landmark"
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
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Postal code <span className="text-gray-400">(optional)</span></label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.name && formData.phone && formData.address && formData.city) {
                              setShowAddressForm(false);
                            }
                          }}
                          className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-black transition-colors"
                        >
                          Save address
                        </button>
                        {hasAddress && (
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2.5"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-5 pt-5 border-t border-gray-200">
                    <Truck className="w-4 h-4 flex-shrink-0" />
                    <span>{deliveryLabel} · Rs. {SHIPPING_CHARGE} shipping</span>
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">Payment method</h2>
                <p className="text-xs text-gray-500 mb-4">eSewa online payment coming soon</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`flex items-start gap-4 p-5 border cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex items-start gap-3">
                      <Banknote className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500 mt-1">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-5 border border-gray-200 bg-gray-50/50 cursor-not-allowed opacity-60">
                    <input type="radio" disabled className="mt-1 w-4 h-4" />
                    <div className="flex items-start gap-3">
                      <Wallet className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">eSewa</p>
                        <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                      </div>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* Right — Order summary */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 bg-gray-50 p-6 lg:p-8">
                <h2 className="text-base font-semibold text-gray-900 mb-6">
                  Order summary
                  <span className="text-sm font-normal text-gray-500 ml-2">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                </h2>

                <div className="space-y-4 mb-6 max-h-56 overflow-y-auto">
                  {checkoutItems.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                          {item.quantity || 1}
                        </span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        {item.size && <p className="text-xs text-gray-500 mt-1">Size {item.size}</p>}
                      </div>
                      <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                        Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-5 border-t border-gray-200 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">Rs. {SHIPPING_CHARGE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Est. delivery</span>
                    <span className="text-gray-500">{deliveryLabel.replace('Delivery by ', '')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-5 border-t border-gray-200 mb-6">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">Rs. {total.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gray-900 text-white py-3.5 text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Placing order...' : 'Place order'}
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">Secure checkout · 14-day returns</p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
