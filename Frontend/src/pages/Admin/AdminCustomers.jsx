import { useState, useEffect, useMemo } from 'react';
import { Users, Search, X, ShoppingBag, Mail, Pencil } from 'lucide-react';
import api from '../../api/axios';
import PasswordInput from '../../components/PasswordInput';

const labelClass = 'text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold';
const inputLabelClass = 'block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1.5';
const inputClass =
  'w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors';
const thClass = 'px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400';
const tdClass = 'px-4 py-3 text-sm text-gray-700';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/customers');
      setCustomers(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const openCustomer = async (customer) => {
    setSelected(customer);
    setDetail(null);
    setDetailLoading(true);
    setEditOpen(false);
    try {
      const res = await api.get(`/admin/customers/${customer._id}`);
      setDetail(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customer details');
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setDetail(null);
    setEditOpen(false);
    setEditMsg({ type: '', text: '' });
  };

  const openEdit = (customer) => {
    setEditForm({ name: customer.name || '', email: customer.email || '', password: '' });
    setEditMsg({ type: '', text: '' });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    setEditSaving(true);
    setEditMsg({ type: '', text: '' });

    try {
      const res = await api.put(`/admin/customers/${selected._id}`, {
        name: editForm.name,
        email: editForm.email,
        password: editForm.password || undefined,
      });

      const updated = res.data.data;
      setCustomers((prev) =>
        prev.map((c) => (c._id === updated._id ? { ...c, name: updated.name, email: updated.email } : c))
      );
      setSelected((prev) => (prev ? { ...prev, name: updated.name, email: updated.email } : prev));
      if (detail) {
        setDetail((prev) => ({
          ...prev,
          customer: { ...prev.customer, name: updated.name, email: updated.email },
        }));
      }
      setEditMsg({ type: 'success', text: 'Customer updated successfully' });
      setEditForm((prev) => ({ ...prev, password: '' }));
      setTimeout(() => setEditOpen(false), 1200);
    } catch (err) {
      setEditMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update customer' });
    } finally {
      setEditSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className={labelClass}>{customers.length} registered customers</p>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>
      )}

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
                  {['Customer', 'Email', 'Orders', 'Total spent', 'Joined', 'Last order', 'Actions'].map((h) => (
                    <th key={h} className={thClass}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((customer) => (
                  <tr key={customer._id} className="hover:bg-[#f9f9f7]/50">
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black overflow-hidden shrink-0">
                          {customer.profilePicture ? (
                            <img src={customer.profilePicture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            customer.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-bold text-black">{customer.name}</span>
                      </div>
                    </td>
                    <td className={`${tdClass} text-[13px] text-gray-500`}>{customer.email}</td>
                    <td className={tdClass}>{customer.orderCount}</td>
                    <td className={`${tdClass} font-black`}>Rs. {customer.totalSpent?.toLocaleString()}</td>
                    <td className={`${tdClass} text-[11px] text-gray-400`}>{formatDate(customer.createdAt)}</td>
                    <td className={`${tdClass} text-[11px] text-gray-400`}>{formatDate(customer.lastOrderAt)}</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openCustomer(customer)}
                          className="text-[10px] uppercase tracking-wider font-bold text-gray-500 hover:text-black"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(customer);
                            openEdit(customer);
                          }}
                          className="text-[10px] uppercase tracking-wider font-bold text-gray-500 hover:text-black inline-flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
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
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 mb-1">No customers found</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {search ? 'Try a different search' : 'Customers appear after signup'}
            </p>
          </div>
        )}
      </div>

      {(selected && (detail || editOpen)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeDetail} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-black overflow-hidden shrink-0">
                  {selected.profilePicture ? (
                    <img src={selected.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    selected.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black uppercase text-black truncate">
                    {editOpen ? 'Edit customer' : selected.name}
                  </h2>
                  <p className="text-[10px] text-gray-400 truncate">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!editOpen && detail && (
                  <button
                    type="button"
                    onClick={() => openEdit(selected)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-600 border border-gray-200 hover:border-black hover:text-black"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                )}
                <button type="button" onClick={closeDetail} className="text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {editOpen ? (
              <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
                {editMsg.text && (
                  <div
                    className={`px-4 py-3 text-sm ${
                      editMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'
                    }`}
                  >
                    {editMsg.text}
                  </div>
                )}

                <div>
                  <label className={inputLabelClass}>Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={inputLabelClass}>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={inputLabelClass}>
                    New password <span className="normal-case tracking-normal font-normal text-gray-300">(optional)</span>
                  </label>
                  <PasswordInput
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditOpen(false);
                      setEditMsg({ type: '', text: '' });
                    }}
                    className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold text-gray-500 border border-gray-200 hover:border-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSaving}
                    className="px-5 py-2.5 text-[10px] uppercase tracking-wider font-black bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {editSaving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            ) : detailLoading ? (
              <div className="py-16 flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-gray-200 border-t-black rounded-full" />
              </div>
            ) : detail ? (
              <div className="p-5 space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Orders', value: detail.stats.orderCount },
                    { label: 'Total spent', value: `Rs. ${detail.stats.totalSpent.toLocaleString()}` },
                    { label: 'Messages', value: detail.stats.messageCount },
                  ].map((item) => (
                    <div key={item.label} className="border border-gray-100 bg-[#f9f9f7] px-3 py-3">
                      <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</p>
                      <p className="text-sm font-black text-black mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                    <p className={labelClass}>Order history</p>
                  </div>
                  {detail.orders.length === 0 ? (
                    <p className="text-xs text-gray-400">No orders yet</p>
                  ) : (
                    <div className="space-y-2">
                      {detail.orders.map((order) => (
                        <div key={order._id} className="border border-gray-100 px-4 py-3">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-xs font-black">#{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs font-black">Rs. {order.totalAmount?.toLocaleString()}</p>
                          </div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {order.orderStatus} · {order.paymentStatus} · {formatDate(order.createdAt)}
                          </p>
                          <div className="mt-2 space-y-0.5">
                            {order.items?.map((item, i) => (
                              <p key={i} className="text-[10px] text-gray-600">
                                {item.product?.name || 'Product'} × {item.quantity || 1}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <p className={labelClass}>Contact messages</p>
                  </div>
                  {detail.messages.length === 0 ? (
                    <p className="text-xs text-gray-400">No messages</p>
                  ) : (
                    <div className="space-y-2">
                      {detail.messages.map((msg) => (
                        <div key={msg._id} className="border border-gray-100 px-4 py-3">
                          <p className="text-xs font-bold text-black">{msg.subject}</p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                            {msg.status} · {formatDate(msg.createdAt)}
                          </p>
                          <p className="text-[11px] text-gray-600 mt-2 line-clamp-2">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-gray-400">
                  Member since {formatDate(detail.customer.createdAt)}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
