import { useState, useEffect } from 'react';
import { Mail, Phone, Send, Clock } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      const res = await api.post('/contact', formData);
      const { isFollowUp, previousCount } = res.data.data || {};
      const baseMsg = res.data.message || 'Message sent successfully! We will get back to you soon.';
      setStatus(
        isFollowUp
          ? `${baseMsg} We have your earlier message${previousCount > 1 ? 's' : ''} on file too.`
          : baseMsg
      );
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-gray-300 text-sm text-gray-900 px-3 py-2.5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900';

  const lockedInputClass =
    'w-full bg-gray-50 border border-gray-200 text-sm text-gray-700 px-3 py-2.5 cursor-not-allowed';

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: 'nonvintagenepal@gmail.com',
      href: 'mailto:nonvintagenepal@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+977 980-0000000',
      href: 'tel:+9779800000000',
    },
    {
      icon: Clock,
      label: 'Response time',
      value: 'Usually within 24 hours',
    },
  ];

  return (
    <div className="bg-white">

      <div className="w-full max-w-5xl mx-auto px-6 lg:px-10 pt-5 pb-12">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Contact us</h1>
          <p className="text-sm text-gray-500">
            Have a question about a piece? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact info — compact list */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 divide-y divide-gray-200">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900">{label}</p>
                    {href ? (
                      <a href={href} className="text-xs text-gray-500 hover:text-gray-900 transition-colors truncate block">
                        {value}
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="border border-gray-200 p-4 lg:p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Send a message</h2>

              {status && (
                <div
                  className={`mb-4 p-3 text-xs ${
                    status.includes('successfully') || status.includes('get back')
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  }`}
                >
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Your name
                      {user && <span className="text-gray-400 font-normal"> — from your account</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={user ? lockedInputClass : inputClass}
                      readOnly={!!user}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Email address
                      {user && <span className="text-gray-400 font-normal"> — from your account</span>}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={user ? lockedInputClass : inputClass}
                      readOnly={!!user}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={inputClass}
                    placeholder="What is this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="4"
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? 'Sending...' : 'Send message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
