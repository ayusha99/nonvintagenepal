function Shipping() {
  return (
    <div className="min-h-screen bg-white py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-12">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">Delivery Information</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-sm text-gray-600">
            Everything you need to know about our shipping process and delivery times.
          </p>
        </div>

        <div className="space-y-8">
          {/* Shipping Areas */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Areas
            </h2>
            <div className="bg-gray-50 border border-gray-200 p-5">
              <p className="text-sm text-gray-700 mb-3">
                We currently ship to all locations within Nepal.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-gray-900 flex-shrink-0" />
                  Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-gray-900 flex-shrink-0" />
                  Major cities across Nepal
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-gray-900 flex-shrink-0" />
                  Remote areas (may require additional time)
                </li>
              </ul>
            </div>
          </section>

          {/* Delivery Times */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Times
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Kathmandu Valley
                </h3>
                <p className="text-sm text-gray-600">
                  1-2 business days
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Outside Valley
                </h3>
                <p className="text-sm text-gray-600">
                  3-5 business days
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * Delivery times may vary during festivals and peak seasons.
            </p>
          </section>

          {/* Shipping Costs */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Costs
            </h2>
            <div className="bg-gray-50 border border-gray-200 p-5">
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>Kathmandu Valley</span>
                  <span className="font-semibold">Rs. 100</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span>Outside Kathmandu Valley</span>
                  <span className="font-semibold">Rs. 150</span>
                </div>
                <div className="flex justify-between">
                  <span>Free shipping on orders over</span>
                  <span className="font-semibold">Rs. 5,000</span>
                </div>
              </div>
            </div>
          </section>

          {/* Order Tracking */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Tracking
            </h2>
            <div className="bg-gray-50 border border-gray-200 p-5">
              <p className="text-sm text-gray-700 mb-3">
                Once your order is shipped, you'll receive:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-gray-900 flex-shrink-0" />
                  Email confirmation with order details
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-gray-900 flex-shrink-0" />
                  Tracking updates on your order status
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-gray-900 flex-shrink-0" />
                  Notification when out for delivery
                </li>
              </ul>
            </div>
          </section>

          {/* Packaging */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Packaging
            </h2>
            <div className="bg-gray-50 border border-gray-200 p-5">
              <p className="text-sm text-gray-700">
                All items are carefully packaged to ensure they arrive in perfect condition. We use eco-friendly packaging materials whenever possible to minimize our environmental impact.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gray-900 text-white p-6 text-center">
            <h3 className="text-sm font-semibold mb-2">
              Questions about shipping?
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Our team is here to help with any delivery concerns.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-gray-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Shipping;
