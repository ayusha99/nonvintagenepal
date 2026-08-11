import { useState } from 'react';
import { Mail, Phone, Send } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    setTimeout(() => {
      setStatus('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 lg:px-12">
      <div className="text-center mb-6">
        <h1 className="text-[11px] font-bold text-gray-900 tracking-widest uppercase mb-2">Contact Us</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Have a question about a piece? Looking for something specific? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-3">
          <div className="bg-white p-4 border border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-gray-900">Email</h3>
              <p className="text-[10px] text-gray-500">nonvintagenepal@gmail.com</p>
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-gray-900">Phone</h3>
              <p className="text-[10px] text-gray-500">+977 980-0000000</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-100 p-5">
            <h2 className="text-[11px] font-bold text-gray-900 mb-4 uppercase tracking-widest">Send a Message</h2>

            {status && (
              <div className={`mb-4 p-2.5 text-xs ${status.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'Sending...'}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest bg-black hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                <Send className="w-3 h-3" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
