import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h1>
            <p className="text-sm text-gray-500">Create your account</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-6 text-sm rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-blue-50 border-0 text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all rounded"
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-blue-50 border-0 text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all rounded"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-blue-50 border-0 text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all rounded"
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-blue-50 border-0 text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all rounded"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-cyan-400 text-white py-3 font-semibold uppercase tracking-wider hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded shadow-sm"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-900 hover:text-cyan-400 font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
