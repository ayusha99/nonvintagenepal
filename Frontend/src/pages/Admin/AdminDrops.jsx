import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Layers } from 'lucide-react';
import api from '../../api/axios';
import { useDrops } from '../../hooks/useDrops';

const labelClass = 'block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1.5';
const inputClass =
  'w-full px-3 py-2.5 bg-[#f9f9f7] border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors';

const EMPTY = {
  label: '',
  title: '',
  subtitle: '',
  image: '',
  sortOrder: '',
  isActive: true,
};

function AdminDrops() {
  const { drops, loading, refetch } = useDrops({ admin: true });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY, sortOrder: String(drops.length + 1) });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (drop) => {
    setEditingId(drop._id);
    setForm({
      label: drop.label,
      title: drop.title,
      subtitle: drop.subtitle,
      image: drop.image,
      sortOrder: String(drop.sortOrder ?? ''),
      isActive: drop.isActive,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
      };
      if (editingId) {
        await api.put(`/admin/drops/${editingId}`, payload);
      } else {
        await api.post('/admin/drops', payload);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save drop');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (drop) => {
    if (!confirm(`Delete "${drop.label}"? Products in this drop will be unassigned.`)) return;
    try {
      await api.delete(`/admin/drops/${drop._id}`);
      refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete drop');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Manage drops</p>
          <p className="text-xs text-gray-500 mt-1">New drops appear on homepage & product upload automatically.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800"
        >
          <Plus className="w-3.5 h-3.5" /> Add Drop
        </button>
      </div>

      {error && !modalOpen && (
        <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>
      )}

      <div className="border border-gray-200 bg-white">
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-gray-200 border-t-black rounded-full" />
          </div>
        ) : drops.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {drops.map((drop) => (
              <div key={drop._id} className="flex items-center gap-4 p-4 hover:bg-[#f9f9f7]/50">
                <img src={drop.image} alt="" className="w-14 h-[74px] object-cover object-top bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-black">{drop.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{drop.title}</p>
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">
                    {drop.slug} · order {drop.sortOrder}
                    {!drop.isActive && ' · hidden'}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => openEdit(drop)} className="p-2 text-gray-400 hover:text-black">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDelete(drop)} className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Layers className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900">No drops yet</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase">{editingId ? 'Edit Drop' : 'Add Drop'}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="bg-red-50 text-red-600 px-3 py-2 text-sm">{error}</div>}

              <div>
                <label className={labelClass}>Admin label *</label>
                <input className={inputClass} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required placeholder="Drop 04 — Summer" />
              </div>
              <div>
                <label className={labelClass}>Homepage title *</label>
                <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <input className={inputClass} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Drop 04" />
              </div>
              <div>
                <label className={labelClass}>Cover image path *</label>
                <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required placeholder="/drops/my-drop.png" />
                <p className="text-[9px] text-gray-400 mt-1">Upload image to Frontend/public/drops/ then paste path here.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Sort order</label>
                  <input type="number" className={inputClass} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} min="0" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Show on site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-[10px] uppercase font-bold text-gray-500 border border-gray-200">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-[10px] uppercase font-black bg-black text-white disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save drop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDrops;
