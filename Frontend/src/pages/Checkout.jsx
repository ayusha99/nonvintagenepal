import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

function Checkout() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Will implement order creation later
    console.log('Order:', { ...formData, items, total });
    alert('Order placed successfully! (Demo)');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-dark-light border border-white/10 p-6">
                <h2 className="text-white font-bold mb-6 uppercase tracking-wider">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-dark border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-dark border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-dark border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-white/30"
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-dark border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-white/30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full bg-dark border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-dark-light border border-white/10 p-6">
                <h2 className="text-white font-bold mb-6 uppercase tracking-wider">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-white/10 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="text-white text-sm uppercase tracking-wide">Cash on Delivery</span>
                  </label>

                  <label className="flex items-center p-4 border border-white/10 cursor-pointer opacity-40">
                    <input type="radio" name="paymentMethod" value="esewa" disabled className="mr-3" />
                    <span className="text-gray-400 text-sm uppercase tracking-wide">eSewa (Coming Soon)</span>
                  </label>

                  <label className="flex items-center p-4 border border-white/10 cursor-pointer opacity-40">
                    <input type="radio" name="paymentMethod" value="khalti" disabled className="mr-3" />
                    <span className="text-gray-400 text-sm uppercase tracking-wide">Khalti (Coming Soon)</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-gold-accent text-black py-4 font-medium uppercase tracking-wider hover:bg-gold-light transition-colors">
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light border border-white/10 p-6 sticky top-20">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wider">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm pb-3 border-b border-white/10">
                    <span className="text-gray-400 truncate mr-2">{item.name}</span>
                    <span className="text-white font-medium">NPR {item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-white">NPR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
