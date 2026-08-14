import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, ShoppingBag } from 'lucide-react';
import api from '../api/axios';

function formatTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString('en-NP', { day: 'numeric', month: 'short' });
}

function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ total: 0, counts: {}, items: [] });
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/notifications');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleOpen = () => {
    setOpen((v) => !v);
    if (!open) fetchNotifications();
  };

  const { total, counts, items } = data;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="relative p-2 text-gray-500 hover:text-black transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" strokeWidth={1.5} />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,320px)] bg-white border border-gray-200 shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-black">Notifications</p>
            {total > 0 && (
              <span className="text-[9px] uppercase tracking-wider font-bold text-red-500">{total} new</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-gray-400">Loading...</p>
            ) : items.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {items.map((item) => {
                  const Icon = item.type === 'message' ? MessageSquare : ShoppingBag;
                  return (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-[#f9f9f7] transition-colors"
                      >
                        <div className="w-8 h-8 bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-black leading-snug">{item.title}</p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                          <p className="text-[9px] text-gray-400 mt-1">{formatTime(item.createdAt)}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-xs text-gray-400">You&apos;re all caught up</p>
            )}
          </div>

          {(counts.newMessages > 0 || counts.pendingOrders > 0) && (
            <div className="px-4 py-3 border-t border-gray-100 flex gap-3">
              {counts.newMessages > 0 && (
                <Link
                  to="/admin/messages"
                  onClick={() => setOpen(false)}
                  className="text-[9px] uppercase tracking-wider font-bold text-gray-600 hover:text-black"
                >
                  {counts.newMessages} message{counts.newMessages !== 1 ? 's' : ''}
                </Link>
              )}
              {counts.pendingOrders > 0 && (
                <Link
                  to="/admin/orders"
                  onClick={() => setOpen(false)}
                  className="text-[9px] uppercase tracking-wider font-bold text-gray-600 hover:text-black"
                >
                  {counts.pendingOrders} order{counts.pendingOrders !== 1 ? 's' : ''}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;
