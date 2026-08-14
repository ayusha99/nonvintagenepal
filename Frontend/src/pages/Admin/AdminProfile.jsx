import { useState, useEffect, useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import PasswordInput from '../../components/PasswordInput';

const labelClass = 'block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1.5';
const inputClass =
  'w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors';

function AdminProfile() {
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

  const displayPhoto = previewUrl || user?.profilePicture;
  const initials = user?.name?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="max-w-6xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Photo card */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-5">Profile photo</p>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-2xl font-black overflow-hidden">
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
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
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

              <p className="text-sm font-black text-black truncate max-w-full">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate max-w-full mt-0.5">{user?.email}</p>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoLoading}
                  className="text-[10px] uppercase tracking-wider font-bold text-gray-600 hover:text-black transition-colors disabled:opacity-50"
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
                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account details */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-200 p-6 lg:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-5">Account details</p>

            {message.text && (
              <div
                className={`mb-5 px-4 py-3 text-sm border ${
                  message.type === 'error'
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : 'bg-green-50 text-green-700 border-green-100'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
              <div>
                <label className={labelClass} htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="password">
                  New password{' '}
                  <span className="normal-case tracking-normal font-normal text-gray-300">(optional)</span>
                </label>
                <PasswordInput
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
