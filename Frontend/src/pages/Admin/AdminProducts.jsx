import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Trash2, X, UploadCloud, Box, Pencil, ExternalLink, ChevronDown } from 'lucide-react';
import api from '../../api/axios';
import ProductImageCropper from '../../components/ProductImageCropper';

import { PRODUCT_CATEGORIES, getCategoryLabel, normalizeCategorySlug } from '../../constants/categories';
import { useDrops, getDropLabelFromList } from '../../hooks/useDrops';

const CATEGORIES = PRODUCT_CATEGORIES;
const CONDITIONS = ['like new', 'good', 'fair'];

const EMPTY_FORM = {
  name: '', description: '', category: 'tops', price: '', stock: '1', condition: 'good', size: '', brand: '', drop: '',
};

const labelClass = 'block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1.5';
const inputClass = 'w-full px-3 py-2.5 bg-[#f9f9f7] border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors';
const filterSelectClass =
  'w-full h-full pl-3 pr-8 py-2.5 bg-transparent text-[10px] uppercase tracking-wider font-bold text-gray-600 focus:outline-none cursor-pointer appearance-none';

function AdminProducts() {
  const [searchParams] = useSearchParams();
  const { drops: storeDrops } = useDrops({ admin: true, activeOnly: true });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [dropFilter, setDropFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cropQueue, setCropQueue] = useState([]);
  const [activeCrop, setActiveCrop] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?status=all');
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
      const matchCat = !categoryFilter || p.category === categoryFilter;
      const matchStatus = !statusFilter || p.status === statusFilter;
      const matchDrop = !dropFilter || p.drop === dropFilter;
      return matchSearch && matchCat && matchStatus && matchDrop;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImages([]);
    setImagePreview([]);
    setExistingImages([]);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: normalizeCategorySlug(product.category),
      price: String(product.price),
      stock: String(product.stock ?? 1),
      condition: product.condition,
      size: product.size || '',
      brand: product.brand || '',
      drop: product.drop || '',
    });
    setExistingImages(product.images || []);
    setImages([]);
    setImagePreview([]);
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setActiveCrop(null);
    setCropQueue([]);
  };

  const startCropQueue = (files) => {
    const queue = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setCropQueue(queue);
    setActiveCrop(queue[0]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    startCropQueue(files);
  };

  const handleCropComplete = (croppedFile) => {
    setImages((prev) => [...prev, croppedFile]);
    setImagePreview((prev) => [...prev, URL.createObjectURL(croppedFile)]);

    const remaining = cropQueue.slice(1);
    if (remaining.length > 0) {
      setCropQueue(remaining);
      setActiveCrop(remaining[0]);
    } else {
      setCropQueue([]);
      setActiveCrop(null);
    }
  };

  const handleCropCancel = () => {
    const remaining = cropQueue.slice(1);
    if (remaining.length > 0) {
      setCropQueue(remaining);
      setActiveCrop(remaining[0]);
    } else {
      setCropQueue([]);
      setActiveCrop(null);
    }
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let imageUrls = [...existingImages];
      if (images.length > 0) {
        const fd = new FormData();
        images.forEach((img) => fd.append('images', img));
        const uploadRes = await api.post('/products/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrls = editingId ? [...existingImages, ...uploadRes.data.data] : uploadRes.data.data;
      }

      if (imageUrls.length === 0) {
        setError('At least one image is required');
        setUploading(false);
        return;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: imageUrls,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setSuccess('Product updated');
      } else {
        await api.post('/products', payload);
        setSuccess('Product added');
      }

      closeModal();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      setSuccess('Product deleted');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete');
    }
  };

  const markSold = async (product) => {
    try {
      await api.put(`/products/${product._id}`, { stock: 0, status: 'sold' });
      setSuccess('Marked as sold');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-1 gap-3 sm:gap-4 sm:items-stretch">
          <div className="relative flex-1 min-w-0 bg-white border border-gray-200">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-full pl-9 pr-3 py-2.5 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-0 sm:shrink-0 sm:bg-white sm:border sm:border-gray-200 sm:overflow-hidden sm:divide-x sm:divide-gray-100">
            <div className="relative sm:w-[170px] bg-white border border-gray-200 sm:border-0">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={filterSelectClass}
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{getCategoryLabel(c)}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative sm:w-[150px] bg-white border border-gray-200 sm:border-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={filterSelectClass}
              >
                <option value="">All status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative sm:w-[160px] bg-white border border-gray-200 sm:border-0">
              <select
                value={dropFilter}
                onChange={(e) => setDropFilter(e.target.value)}
                className={filterSelectClass}
              >
                <option value="">All drops</option>
                {storeDrops.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors shrink-0 w-full lg:w-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {error && <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>}
      {success && <div className="border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm">{success}</div>}

      {/* Table */}
      <div className="border border-gray-200 bg-white">
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-gray-200 border-t-black rounded-full" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-[#f9f9f7]">
                  {['Product', 'Category', 'Drop', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-[#f9f9f7]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0]} alt="" className="w-10 h-12 object-cover bg-gray-100 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-black truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{product.brand || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500 capitalize">{product.category}</td>
                    <td className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                      {product.drop ? getDropLabelFromList(storeDrops, product.drop) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-black">Rs. {product.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{product.stock ?? 1}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-1 ${
                        product.status === 'available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-black" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <Link to={`/products/${product._id}`} target="_blank" className="p-2 text-gray-400 hover:text-black" title="View">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        {product.status === 'available' && (
                          <button onClick={() => markSold(product)} className="px-2 py-1 text-[9px] uppercase tracking-wider font-bold text-gray-400 hover:text-black border border-gray-200 hover:border-black transition-colors">
                            Sold
                          </button>
                        )}
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Box className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 mb-1">No products found</p>
            <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-wider">Add your first item to the archive</p>
            <button onClick={openAdd} className="bg-black text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em]">
              Add Product
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{filtered.length} of {products.length} products</p>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="fixed inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-black uppercase tracking-wide">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black"><X className="w-5 h-5" /></button>
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
              {error && <div className="bg-red-50 text-red-600 px-3 py-2 text-sm">{error}</div>}

              <div>
                <label className={labelClass}>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={`${inputClass} capitalize`}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>New drop</label>
                  <select value={formData.drop} onChange={(e) => setFormData({ ...formData, drop: e.target.value })} className={inputClass}>
                    <option value="">No drop — not shown in New Drop</option>
                    {storeDrops.map((d) => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className={`${inputClass} capitalize`}>
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Brand</label>
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (Rs.) *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputClass} required min="0" />
                </div>
                <div>
                  <label className={labelClass}>Stock *</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className={inputClass} required min="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Size</label>
                  <input type="text" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} resize-none`} rows={4} required />
              </div>

              <div>
                <label className={labelClass}>Images {editingId ? '(add more)' : '*'} </label>
                {existingImages.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {existingImages.map((src, i) => (
                      <img key={i} src={src} alt="" className="w-14 h-14 object-cover border border-gray-200" />
                    ))}
                  </div>
                )}
                <label className="block border border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-black transition-colors">
                  <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block">Upload images</span>
                  <span className="text-[9px] text-gray-400 mt-1 block">Instagram-style crop · 3:4 · same size for all</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                </label>
                {imagePreview.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {imagePreview.map((src, i) => (
                      <div key={i} className="relative">
                        <img src={src} alt="" className="w-16 h-[85px] object-cover border border-gray-200" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-gray-500 border border-gray-200 hover:border-black transition-colors">
                Cancel
              </button>
              <button type="submit" form="product-form" disabled={uploading} className="px-5 py-2.5 text-[10px] uppercase tracking-wider font-black bg-black text-white hover:bg-gray-800 disabled:opacity-50">
                {uploading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeCrop && (
        <ProductImageCropper
          imageSrc={activeCrop.preview}
          fileName={activeCrop.file.name}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}

export default AdminProducts;
