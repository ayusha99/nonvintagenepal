function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      body: [
        'When you create an account, we collect your name, email address, and password (stored securely as a hash).',
        'When you place an order, we collect shipping details such as your name, phone number, and delivery address within Nepal.',
        'We may collect usage data such as pages visited and device type to improve the shopping experience on mobile and desktop.',
      ],
    },
    {
      title: 'How We Use Your Information',
      body: [
        'To process orders, payments, and deliveries.',
        'To manage your account, wishlist, and order history.',
        'To respond to customer support requests and send order updates.',
        'To send password reset emails when you request them.',
      ],
    },
    {
      title: 'Sharing Your Information',
      body: [
        'We do not sell your personal data.',
        'We may share delivery information with courier partners only to fulfil your order.',
        'We may disclose information if required by law in Nepal.',
      ],
    },
    {
      title: 'Cookies & Local Storage',
      body: [
        'We use cookies and browser storage to keep you logged in and remember your cart.',
        'You can clear cookies in your browser settings, but some features may not work without them.',
      ],
    },
    {
      title: 'Data Security',
      body: [
        'Passwords are encrypted and never stored in plain text.',
        'We use secure connections (HTTPS) in production to protect data in transit.',
      ],
    },
    {
      title: 'Your Rights',
      body: [
        'You can update your profile information from your account page.',
        'You may contact us to request account deletion or correction of your data.',
      ],
    },
    {
      title: 'Contact',
      body: [
        'For privacy questions, contact us through the Contact page or Instagram @nonvintagenepal.',
        'Last updated: August 2026.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white py-10 lg:py-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2 font-bold">Legal</p>
          <h1
            className="text-2xl md:text-4xl font-black uppercase text-black"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            Non Vintage Nepal respects your privacy. This policy explains how we handle your information
            when you shop on our website from any device, including iPhone and Android browsers.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="border border-gray-100 p-6 lg:p-8">
              <h2 className="text-sm font-black uppercase tracking-wide text-black mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.body.map((line) => (
                  <li key={line} className="text-sm text-gray-600 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-gray-300 before:rounded-full">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
