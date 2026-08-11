import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
      });
      updateUser(res.data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-6">
      <h1 className="text-[11px] font-bold text-gray-900 tracking-widest mb-4 text-center uppercase">Manage My Account</h1>

      <div className="bg-white border border-gray-100 p-5">
        {message.text && (
          <div className={`mb-4 p-2.5 text-xs font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              New Password <span className="text-[10px] text-gray-400 font-normal">(leave blank to keep current)</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest bg-black hover:bg-gray-900 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
