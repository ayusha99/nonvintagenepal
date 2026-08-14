import { useState, useEffect, useMemo } from 'react';
import { Mail, Trash2, X, MessageSquare, ChevronDown } from 'lucide-react';
import api from '../../api/axios';

const STATUSES = ['new', 'read', 'replied'];

const labelClass = 'text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold';
const filterSelectClass =
  'w-full h-full pl-3 pr-8 py-2.5 bg-transparent text-[10px] uppercase tracking-wider font-bold text-gray-600 focus:outline-none cursor-pointer appearance-none';

const statusStyle = {
  new: 'bg-blue-50 text-blue-700',
  read: 'bg-amber-50 text-amber-700',
  replied: 'bg-green-50 text-green-700',
};

const getCustomerKey = (msg) => {
  const userId = msg.user?._id || msg.user;
  return userId ? String(userId) : msg.email?.toLowerCase();
};

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/contact');
      setMessages(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!statusFilter) return messages;
    return messages.filter((m) => m.status === statusFilter);
  }, [messages, statusFilter]);

  const newCount = messages.filter((m) => m.status === 'new').length;

  const customerMessageCounts = useMemo(() => {
    const counts = {};
    messages.forEach((m) => {
      const key = getCustomerKey(m);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [messages]);

  const relatedMessages = useMemo(() => {
    if (!selected) return [];
    const key = getCustomerKey(selected);
    return messages.filter((m) => m._id !== selected._id && getCustomerKey(m) === key);
  }, [messages, selected]);

  const openMessage = async (msg) => {
    setSelected(msg);
    setAdminNotes(msg.adminNotes || '');

    if (msg.status === 'new') {
      try {
        const res = await api.put(`/contact/${msg._id}`, { status: 'read' });
        const updated = res.data.data;
        setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
        setSelected(updated);
      } catch {
        setError('Failed to mark message as read');
      }
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setAdminNotes('');
  };

  const updateStatus = async (status) => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await api.put(`/contact/${selected._id}`, { status, adminNotes });
      const updated = res.data.data;
      setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      setSelected(updated);
    } catch {
      setError('Failed to update message');
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await api.put(`/contact/${selected._id}`, { adminNotes });
      const updated = res.data.data;
      setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      setSelected(updated);
    } catch {
      setError('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) closeDetail();
    } catch {
      setError('Failed to delete message');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-NP', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className={labelClass}>{messages.length} messages</p>
          {newCount > 0 && (
            <p className="text-[10px] text-blue-600 font-bold mt-1">{newCount} unread</p>
          )}
        </div>
        <div className="relative w-full sm:w-[160px] bg-white border border-gray-200">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={filterSelectClass}
          >
            <option value="">All status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  {['From', 'Subject', 'Status', 'Date', ''].map((h) => (
                    <th key={h || 'actions'} className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((msg) => (
                  <tr
                    key={msg._id}
                    className={`hover:bg-[#f9f9f7]/50 cursor-pointer transition-colors ${
                      selected?._id === msg._id ? 'bg-[#f9f9f7]' : ''
                    } ${msg.status === 'new' ? 'font-semibold' : ''}`}
                    onClick={() => openMessage(msg)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div>
                          <p className="text-sm font-bold text-black">{msg.name}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[180px]">{msg.email}</p>
                        </div>
                        {(customerMessageCounts[getCustomerKey(msg)] || 0) > 1 && (
                          <span className="text-[8px] uppercase tracking-wider font-black px-1.5 py-0.5 bg-gray-100 text-gray-600">
                            ×{customerMessageCounts[getCustomerKey(msg)]}
                          </span>
                        )}
                        {msg.user && (
                          <span className="text-[8px] uppercase tracking-wider font-black px-1.5 py-0.5 bg-black text-white">
                            Account
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 max-w-[200px] truncate">{msg.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-1 ${statusStyle[msg.status]}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-gray-500 whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg._id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 mb-1">No messages yet</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Customer messages from the contact page will appear here
            </p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="fixed inset-0 bg-black/40" onClick={closeDetail} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Message</p>
                <h2 className="text-sm font-black text-black truncate">{selected.subject}</h2>
                <p className="text-[10px] text-gray-500 mt-1">{formatDate(selected.createdAt)}</p>
              </div>
              <button type="button" onClick={closeDetail} className="text-gray-400 hover:text-black shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4 flex-1">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 bg-black text-white flex items-center justify-center text-xs font-black shrink-0">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-black">{selected.name}</p>
                  <a href={`mailto:${selected.email}`} className="text-xs text-gray-500 hover:text-black truncate block">
                    {selected.email}
                  </a>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>

              {relatedMessages.length > 0 && (
                <div className="border border-gray-100 bg-[#f9f9f7] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Earlier messages from this customer ({relatedMessages.length})
                  </p>
                  <ul className="space-y-2 max-h-32 overflow-y-auto">
                    {relatedMessages.map((m) => (
                      <li key={m._id}>
                        <button
                          type="button"
                          onClick={() => openMessage(m)}
                          className="w-full text-left px-2 py-1.5 hover:bg-white border border-transparent hover:border-gray-200 transition-colors"
                        >
                          <p className="text-xs font-bold text-gray-800 truncate">{m.subject}</p>
                          <p className="text-[10px] text-gray-400">{formatDate(m.createdAt)} · {m.status}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className={`${labelClass} mb-1.5 block`}>Internal notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Notes for yourself (not sent to customer)..."
                  className="w-full px-3 py-2.5 bg-[#f9f9f7] border border-gray-200 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={saving || selected.status === s}
                    onClick={() => updateStatus(s)}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-black border transition-colors disabled:opacity-40 ${
                      selected.status === s
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-600 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[9px] uppercase tracking-wider font-black border border-gray-200 text-gray-600 hover:border-black transition-colors"
                >
                  <Mail className="w-3 h-3" /> Email customer
                </a>
                <button
                  type="button"
                  onClick={saveNotes}
                  disabled={saving}
                  className="px-4 py-2 text-[9px] uppercase tracking-wider font-black bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  Save notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;
