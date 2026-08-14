import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { getDeliveryLabel, DELIVERY_DAYS } from '../utils/shipping';

function OrderConfirmed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumbs();
  const confirmation = location.state?.confirmation;

  useEffect(() => {
    if (!confirmation) return;
    setBreadcrumbs([
      { label: 'Home', to: '/' },
      { label: 'Shop', to: '/products' },
      { label: 'Order confirmed' },
    ]);
  }, [confirmation, setBreadcrumbs]);

  if (!confirmation) {
    navigate('/profile/orders', { replace: true });
    return null;
  }

  const {
    orderId,
    totalAmount,
    items = [],
    paymentMethod,
  } = confirmation;

  const deliveryLabel = getDeliveryLabel(DELIVERY_DAYS.min, DELIVERY_DAYS.max);
  const orderRef = orderId ? orderId.slice(-6).toUpperCase() : '------';

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="max-w-xl mx-auto px-6 lg:px-12 py-12 lg:py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" strokeWidth={1.75} />
        </div>

        <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2 font-bold">Thank you</p>
        <h1
          className="text-2xl md:text-3xl font-black uppercase text-black mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
        >
          Order Confirmed
        </h1>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Your order has been placed successfully. We&apos;ll send updates to your account as it moves forward.
        </p>

        <div className="border border-gray-200 text-left p-6 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">Order number</p>
              <p className="text-sm font-black text-black mt-1">#{orderRef}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">Total</p>
              <p className="text-sm font-black text-black mt-1">Rs. {totalAmount?.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                {item.images?.[0] && (
                  <img src={item.images[0]} alt={item.name} className="w-12 h-14 object-cover bg-gray-100" />
                )}
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-black truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Qty {item.quantity || 1}
                    {item.size ? ` · Size ${item.size}` : ''}
                  </p>
                </div>
                <p className="text-sm font-bold text-black flex-shrink-0">
                  Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex justify-between gap-4">
              <span>Payment</span>
              <span className="text-gray-900 font-medium capitalize">
                {paymentMethod === 'cod' ? 'Cash on delivery' : paymentMethod}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Estimated delivery</span>
              <span className="text-gray-900 font-medium">{deliveryLabel.replace('Delivery by ', '')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/profile/orders"
            state={{ orderPlaced: true }}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-black text-white px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            View my orders
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center w-full sm:w-auto border border-gray-300 text-black px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:border-black transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmed;
