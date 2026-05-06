"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) setUser(data.user);
        })
        .catch(() => {});
    }
  }, []);

  const handleLogin = (userData: any) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="bg-dark/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Логотип */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="text-2xl group-hover:scale-110 transition-transform">🎸</div>
              <div>
                <div className="text-xl font-bold tracking-tight">
                  <span className="text-red-500">Guitar</span>
                  <span className="text-white">Sync</span>
                </div>
                <div className="text-[10px] text-gray-500 hidden sm:block">играй свободно</div>
              </div>
            </Link>
            
            {/* Десктопное меню */}
            <nav className="hidden md:block">
              <ul className="flex gap-1">
                <NavItem href="/" active={isActive('/')}>Главная</NavItem>
                <NavItem href="/songs" active={isActive('/songs')}>Разборы</NavItem>
                <NavItem href="/lessons" active={isActive('/lessons')}>Уроки</NavItem>
                <NavItem href="/chords" active={isActive('/chords')}>Аккорды</NavItem>
                <NavItem href="/game" active={isActive('/game')} isGame>Игра</NavItem>
                <NavItem href="/tuner" active={isActive('/tuner')}>Тюнер</NavItem>
              </ul>
            </nav>
            
            {/* Кнопка авторизации */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                  >
                    <span className="text-lg">👤</span>
                    <span className="text-sm text-gray-300 hidden sm:inline">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-md transition text-sm"
                >
                  Войти
                </button>
              )}
              
              {/* Мобильная кнопка */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden bg-dark border-t border-gray-800">
            <ul className="py-2">
              <MobileNavItem href="/" onClick={() => setIsMenuOpen(false)}>Главная</MobileNavItem>
              <MobileNavItem href="/songs" onClick={() => setIsMenuOpen(false)}>Разборы</MobileNavItem>
              <MobileNavItem href="/lessons" onClick={() => setIsMenuOpen(false)}>Уроки</MobileNavItem>
              <MobileNavItem href="/chords" onClick={() => setIsMenuOpen(false)}>Аккорды</MobileNavItem>
              <MobileNavItem href="/game" onClick={() => setIsMenuOpen(false)} isGame>Игра</MobileNavItem>
              <MobileNavItem href="/tuner" onClick={() => setIsMenuOpen(false)}>Тюнер</MobileNavItem>
            </ul>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

function NavItem({ href, children, active, isGame }: { 
  href: string; 
  children: React.ReactNode; 
  active: boolean;
  isGame?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`
          relative px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm
          ${active 
            ? 'text-red-500 bg-red-500/10' 
            : isGame 
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-md' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }
        `}
      >
        {children}
        {active && !isGame && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full"></span>
        )}
      </Link>
    </li>
  );
}

function MobileNavItem({ href, children, onClick, isGame }: { 
  href: string; 
  children: React.ReactNode; 
  onClick: () => void;
  isGame?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`
          block px-6 py-2.5 transition-all duration-200 text-sm
          ${active 
            ? 'bg-red-500/20 text-red-500 border-l-4 border-red-500' 
            : isGame
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white mx-4 my-1 rounded-lg text-center'
              : 'text-gray-300 hover:bg-gray-800'
          }
        `}
      >
        {children}
      </Link>
    </li>
  );
}