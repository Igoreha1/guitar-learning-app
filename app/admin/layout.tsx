"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Music, Users, Settings, LogOut, 
  ChevronLeft, ChevronRight, Shield, Bell, Menu, X, 
  Guitar, Sparkles, Star, TrendingUp, Calendar, Clock
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Дашборд', color: 'from-blue-500 to-blue-600' },
    { href: '/admin/articles', icon: FileText, label: 'Статьи', color: 'from-green-500 to-green-600' },
    { href: '/admin/songs', icon: Music, label: 'Песни', color: 'from-purple-500 to-purple-600' },
    { href: '/admin/users', icon: Users, label: 'Пользователи', color: 'from-yellow-500 to-yellow-600' },
    { href: '/admin/settings', icon: Settings, label: 'Настройки', color: 'from-gray-500 to-gray-600' },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 flex flex-col relative z-10`}>
        {/* Logo */}
        <div className={`p-5 border-b border-gray-800 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">Admin<span className="text-primary">Panel</span></div>
                <div className="text-xs text-gray-500">Панель управления</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-white transition-all duration-200 hover:scale-110"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && user && (
          <div className="p-4 mx-3 mt-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-lg">👑</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name || 'Администратор'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50 border border-gray-700 shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Выйти</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap border border-gray-700">
                Выйти
              </div>
            )}
          </button>
        </div>

        {/* Version */}
        {!collapsed && (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-600">v2.0.0 • GuitarSync Admin</p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Guitar className="w-4 h-4" />
              <span>Панель управления</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-300">{menuItems.find(i => i.href === pathname)?.label || 'Главная'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            <div className="w-px h-6 bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                <span className="text-sm text-white font-bold">A</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-white font-medium">{user?.name || 'Администратор'}</p>
                <p className="text-xs text-gray-500">Администратор</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}