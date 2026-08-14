import { useState, useEffect, useRef } from 'react';
import { User, Camera, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
      setPreviewUrl(user.profilePicture || '');
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

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 5MB.' });
      return;
    }

    setPhotoLoading(true);
    setMessage({ type: '', text: '' });

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const photoData = new FormData();
      photoData.append('picture', file);

      const res = await api.post('/auth/profile/picture', photoData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(res.data.data);
      setPreviewUrl(res.data.data.profilePicture);
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setPreviewUrl(user?.profilePicture || '');
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload photo' });
    } finally {
      URL.revokeObjectURL(localPreview);
      setPhotoLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.delete('/auth/profile/picture');
      updateUser(res.data.data);
      setPreviewUrl('');
      setMessage({ type: 'success', text: 'Profile picture removed.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to remove photo' });
    } finally {
      setPhotoLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-gray-300 text-sm text-gray-900 px-4 py-3 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900';

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const displayPhoto = previewUrl || user?.profilePicture;

  return (
    <div className="bg-white">

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 xl:px-16 pt-5 pb-12">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">My account</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Profile summary */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 border border-gray-200 p-6 lg:p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center text-xl font-semibold overflow-hidden">
                    {displayPhoto ? (
                      <img src={displayPhoto} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoLoading}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                    aria-label="Change profile picture"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>

                <p className="text-base font-semibold text-gray-900 truncate max-w-full">{user?.name || 'Guest'}</p>
                <p className="text-sm text-gray-500 truncate max-w-full">{user?.email}</p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoLoading}
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                  >
                    {photoLoading ? 'Uploading...' : 'Change photo'}
                  </button>
                  {displayPhoto && (
                    <>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={photoLoading}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span>Manage your personal details</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="lg:col-span-8">
            <div className="bg-gray-50 border border-gray-200 p-6 lg:p-8">
              <h2 className="text-base font-semibold text-gray-900 mb-6">Account details</h2>

              {message.text && (
                <div
                  className={`mb-6 p-4 text-sm ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-green-50 text-green-700 border border-green-100'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Full name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    New password{' '}
                    <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
