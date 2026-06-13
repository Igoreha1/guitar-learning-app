"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = async (userData: any) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    await fetchUser();
    router.refresh();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  if (isLoading) {
    return (
      <header className="bg-header/80 backdrop-blur-xl border-b border-border-color sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="group flex items-center gap-2">
              <div className="text-2xl group-hover:scale-110 transition-transform">🎸</div>
              <div>
                <div className="text-xl font-bold tracking-tight">
                  <span className="text-primary">Гитар</span>
                  <span className="text-text-primary">Синхро</span>
                </div>
                <div className="text-[10px] text-text-secondary hidden sm:block">играй свободно</div>
              </div>
            </Link>
            <div className="w-8 h-8"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-header/80 backdrop-blur-xl border-b border-border-color sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Логотип */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="text-2xl group-hover:scale-110 transition-transform">🎸</div>
              <div>
                <div className="text-xl font-bold tracking-tight">
                  <span className="text-primary">Гитар</span>
                  <span className="text-text-primary">Синхро</span>
                </div>
                <div className="text-[10px] text-text-secondary hidden sm:block">играй свободно</div>
              </div>
            </Link>
            
            {/* Десктопное меню */}
            <nav className="hidden md:block">
              <ul className="flex gap-1">
                <NavItem href="/songs" active={isActive('/songs')}>Разборы</NavItem>
                <NavItem href="/lessons" active={isActive('/lessons')}>Уроки</NavItem>
                <NavItem href="/chords" active={isActive('/chords')}>Аккорды</NavItem>
                <NavItem href="/game" active={isActive('/game')} isGame>Игра</NavItem>
                <NavItem href="/tuner" active={isActive('/tuner')}>Тюнер</NavItem>
                <NavItem href="/metronome" active={isActive('/metronome')}>Метроном</NavItem>
              </ul>
            </nav>
            
            {/* Кнопка авторизации */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg hover:bg-card-hover transition text-text-secondary hover:text-text-primary"
                  >
                    <span className="text-lg">👤</span>
                    <span className="text-sm hidden sm:inline">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold hover:shadow-md transition text-sm"
                >
                  Войти
                </button>
              )}
              
              {/* Мобильная кнопка */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-card transition"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-text-primary transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-text-primary transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-text-primary transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden bg-card border-t border-border-color">
            <ul className="py-2">
              <MobileNavItem href="/" onClick={() => setIsMenuOpen(false)}>Главная</MobileNavItem>
              <MobileNavItem href="/songs" onClick={() => setIsMenuOpen(false)}>Разборы</MobileNavItem>
              <MobileNavItem href="/lessons" onClick={() => setIsMenuOpen(false)}>Уроки</MobileNavItem>
              <MobileNavItem href="/chords" onClick={() => setIsMenuOpen(false)}>Аккорды</MobileNavItem>
              <MobileNavItem href="/game" onClick={() => setIsMenuOpen(false)} isGame>Игра</MobileNavItem>
              <MobileNavItem href="/tuner" onClick={() => setIsMenuOpen(false)}>Тюнер</MobileNavItem>
              <MobileNavItem href="/metronome" onClick={() => setIsMenuOpen(false)}>Метроном</MobileNavItem>
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
            ? 'text-primary bg-primary/10' 
            : isGame 
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-md' 
              : 'text-text-secondary hover:text-text-primary hover:bg-card'
          }
        `}
      >
        {children}
        {active && !isGame && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"></span>
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
            ? 'bg-primary/20 text-primary border-l-4 border-primary' 
            : isGame
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white mx-4 my-1 rounded-lg text-center'
              : 'text-text-secondary hover:text-text-primary hover:bg-card'
          }
        `}
      >
        {children}
      </Link>
    </li>
  );
}