import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

function Cart() {
  const { items, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8 text-sm">Start shopping to add items to your cart</p>
          <Link to="/products" className="inline-block bg-gold-accent text-black px-8 py-3 font-medium uppercase tracking-wider hover:bg-gold-light transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-wider">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="bg-dark-light border border-white/10 flex gap-4 p-4">
                {/* Image */}
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 h-32 object-cover"
                />

                {/* Info */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.description.slice(0, 60)}...</p>
                  <p className="text-white font-bold">
                    NPR {item.price.toLocaleString()}
                  </p>
                  {item.size && (
                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">Size: {item.size}</p>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-gray-500 hover:text-white text-xs uppercase tracking-wider transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light border border-white/10 p-6 sticky top-20">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wider">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Items ({items.length})</span>
                  <span className="text-white">NPR {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-gray-400 text-xs">At checkout</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-white">NPR {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gold-accent text-black py-3 font-medium uppercase tracking-wider hover:bg-gold-light transition-colors mb-3"
              >
                Proceed to Checkout
              </button>
              
              <Link to="/products" className="block w-full text-center bg-dark border border-white/10 text-white py-3 font-medium uppercase tracking-wider hover:border-white/30 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
