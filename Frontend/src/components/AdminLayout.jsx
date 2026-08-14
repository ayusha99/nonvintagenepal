import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Box,
  LogOut,
  Menu,
  User,
  MessageSquare,
  ChevronDown,
  BarChart3,
  Users,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminNotifications from './AdminNotifications';

const NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Products', href: '/admin/products', icon: Box },
  { name: 'Drops', href: '/admin/drops', icon: Layers },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
];

const PAGE_META = {
  '/admin': { title: 'Dashboard', subtitle: 'Store overview' },
  '/admin/reports': { title: 'Reports', subtitle: 'Live store activity' },
  '/admin/products': { title: 'Products', subtitle: 'Manage inventory' },
  '/admin/drops': { title: 'Drops', subtitle: 'Manage new drop collections' },
  '/admin/orders': { title: 'Orders', subtitle: 'Customer orders' },
  '/admin/customers': { title: 'Customers', subtitle: 'Manage customers' },
  '/admin/messages': { title: 'Messages', subtitle: 'Customer inquiries' },
  '/admin/profile': { title: 'Profile', subtitle: 'Edit your account' },
  '/admin/privacy-policy': { title: 'Privacy Policy', subtitle: 'Legal information' },
};

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const location = useLocation();
  const mainRef = useRef(null);
  const { logout, user } = useAuth();
  const meta = PAGE_META[location.pathname] || PAGE_META['/admin'];

  useLayoutEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  return (
    <div className="min-h-screen flex bg-white">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — full height, sign out pinned at bottom */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-white border-r border-gray-100 flex flex-col h-screen transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:inset-auto shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
          <Link to="/admin" className="hover:opacity-80 transition-opacity">
            <img src="/Non_Vintage_Nepal_Logo_Transparent.png" alt="Non Vintage Nepal" className="h-9 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-black transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="shrink-0 border-t border-gray-100 px-4 py-4">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-black"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1
                className="text-sm font-black uppercase text-black tracking-wide"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {meta.title}
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider hidden sm:block">{meta.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <AdminNotifications />
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-black overflow-hidden shrink-0">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'A'
                  )}
                </div>
                <span className="hidden md:block text-[10px] uppercase tracking-wider font-bold text-gray-600 max-w-[100px] truncate">
                  {user?.name || 'Admin'}
                </span>
                <ChevronDown className={`hidden md:block w-3.5 h-3.5 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 shadow-lg z-50 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-black text-black truncate">{user?.name || 'Admin'}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                      location.pathname === '/admin/profile'
                        ? 'bg-gray-50 text-black'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Edit profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#f9f9f7]">
          <Outlet />
        </main>

        <footer className="bg-gray-300 border-t border-gray-350 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 lg:px-8 py-3.5">
            <p className="text-gray-500 text-[9px] uppercase tracking-[0.3em] font-bold text-center sm:text-left">
              &copy; {new Date().getFullYear()} Non Vintage Nepal. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link to="/admin/privacy-policy" className="text-gray-500 hover:text-black text-[9px] uppercase tracking-[0.3em] font-bold transition-colors">
                Privacy Policy
              </Link>
              <p className="text-gray-500 text-[9px] uppercase tracking-[0.3em] font-bold">Kathmandu, Nepal</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
