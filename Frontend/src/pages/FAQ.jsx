function FAQ() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our collection, add items to your cart, and proceed to checkout. You'll need to create an account or login to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards and online payment systems."
    },
    {
      question: "How long does shipping take?",
      answer: "Delivery within Kathmandu Valley typically takes 1-2 days. Outside valley deliveries take 3-5 business days."
    },
    {
      question: "Can I return or exchange items?",
      answer: "Due to the unique nature of thrift fashion, all sales are final. However, if you receive a damaged item, please contact us within 24 hours."
    },
    {
      question: "Are the items authentic?",
      answer: "Yes! Every item is carefully authenticated, checked, and photographed by our team before listing."
    },
    {
      question: "How often do you add new items?",
      answer: "We add new drops weekly. Follow us on Instagram and TikTok to stay updated on fresh arrivals."
    },
    {
      question: "Do you ship outside Nepal?",
      answer: "Currently, we only ship within Nepal. International shipping may be available in the future."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us through our Contact page, Instagram DMs, or email us directly."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-12">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">Help Center</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-600">
            Find answers to common questions about ordering, shipping, and our products.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 border border-gray-200 p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            We're here to help. Get in touch with our team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gray-900 text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
