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
    // Проверяем токен при загрузке
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

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <span>🎸 Обучающий портал для гитаристов</span>
              <span className="hidden md:inline text-xs">🔥 Более 500 разборов песен</span>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              {/* Логотип */}
              <Link href="/" className="group">
                <div className="flex items-center gap-2">
                  <div className="text-3xl group-hover:scale-110 transition-transform">🎸</div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight">
                      <span className="text-red-600">Guitar</span>
                      <span className="text-gray-800">Sync</span>
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">играй свободно</div>
                  </div>
                </div>
              </Link>
              
              {/* Десктопное меню */}
              <nav className="hidden md:block">
                <ul className="flex gap-1">
                  <NavItem href="/" active={isActive('/')}>Главная</NavItem>
                  <NavItem href="/songs" active={isActive('/songs')}>Разборы</NavItem>
                  <NavItem href="/lessons" active={isActive('/lessons')}>Уроки</NavItem>
                  <NavItem href="/chords" active={isActive('/chords')}>Аккорды</NavItem>
                  <NavItem href="/game" active={isActive('/game')} isGame>🎮 Игра</NavItem>
                  <NavItem href="/tuner" active={isActive('/tuner')}>🎛️ Тюнер</NavItem>
                </ul>
              </nav>
              
              {/* Кнопка авторизации */}
              <div className="flex items-center gap-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <span className="text-lg">👤</span>
                      <span className="text-sm text-gray-700 hidden sm:inline">{user.name}</span>
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
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition shadow-md"
                  >
                    🔐 Войти
                  </button>
                )}
                
                {/* Мобильная кнопка */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-6 h-5 flex flex-col justify-between">
                    <span className={`w-full h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-full h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-full h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
            <ul className="py-2">
              <MobileNavItem href="/" onClick={() => setIsMenuOpen(false)}>Главная</MobileNavItem>
              <MobileNavItem href="/songs" onClick={() => setIsMenuOpen(false)}>Разборы песен</MobileNavItem>
              <MobileNavItem href="/lessons" onClick={() => setIsMenuOpen(false)}>Уроки</MobileNavItem>
              <MobileNavItem href="/chords" onClick={() => setIsMenuOpen(false)}>Аккорды</MobileNavItem>
              <MobileNavItem href="/game" onClick={() => setIsMenuOpen(false)} isGame>🎮 Игра</MobileNavItem>
              <MobileNavItem href="/tuner" onClick={() => setIsMenuOpen(false)}>🎛️ Тюнер</MobileNavItem>
            </ul>
          </div>
        )}
      </header>

      {/* Модальное окно авторизации */}
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
          relative px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${active 
            ? 'text-red-600 bg-red-50' 
            : isGame 
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-md' 
              : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
          }
        `}
      >
        {children}
        {active && !isGame && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-red-600 rounded-full"></span>
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
          block px-6 py-3 transition-all duration-200
          ${active 
            ? 'bg-red-50 text-red-600 border-l-4 border-red-600' 
            : isGame
              ? 'bg-red-600 text-white mx-4 my-2 rounded-lg text-center'
              : 'text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        {children}
      </Link>
    </li>
  );
}