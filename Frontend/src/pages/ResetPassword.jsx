import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import PasswordInput from '../components/PasswordInput';

const labelClass =
  'block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', { token, password });
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password. The link may have expired.');
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
              New Password
            </h1>
            <p className="text-sm text-gray-500 mt-2">Choose a new password for your account</p>
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
                <label className={labelClass} htmlFor="password">
                  New Password
                </label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 touch-manipulation"
                disabled={loading || !token}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500">
              <Link to="/forgot-password" className="text-black font-bold hover:opacity-70 transition-opacity">
                Request a new link
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
