import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const inputClass =
  'w-full bg-[#f9f9f7] border border-gray-200 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-400';

const labelClass =
  'block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow flex items-start justify-center px-6 pt-8 pb-16 lg:pt-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2 font-bold">Account</p>
            <h1
              className="text-2xl md:text-3xl font-black uppercase text-black"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
            >
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 mt-2">Enter your email and we&apos;ll send a reset link</p>
          </div>

          <div className="border border-gray-100 bg-white p-8 lg:p-10">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 mb-6 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 mb-6 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 touch-manipulation"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500">
              Remember your password?{' '}
              <Link to="/login" className="text-black font-bold hover:opacity-70 transition-opacity">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
