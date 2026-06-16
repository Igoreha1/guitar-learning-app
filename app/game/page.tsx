"use client";

import { useState, useEffect } from "react";
import { 
  ChevronRight, Home, Guitar, Music, Heart, Star, 
  Play, Clock, TrendingUp, Sparkles, Volume2, 
  Mic, MicOff, Headphones, Zap, Award, Target,
  ChevronDown, ChevronUp, Search, Filter, X, Trophy, LogIn
} from "lucide-react";
import Link from "next/link";
import GameCanvas from "@/features/game/GameCanvas";
import { GameSong } from "@/features/game/types";
import AuthModal from "@/components/AuthModal";

export default function GamePage() {
  const [selectedSong, setSelectedSong] = useState<GameSong | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [songs, setSongs] = useState<GameSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Следим за изменением темы
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Загружаем песни из API
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const res = await fetch('/api/game/songs');
        const data = await res.json();
        
        const formattedSongs: GameSong[] = data.map((song: any) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          bpm: song.bpm,
          notes: song.notes || [],
          duration: song.duration,
          difficulty: song.difficulty,
          effect: song.effect,
          backingTrack: song.backingTrack,
          startOffset: song.startOffset || 0,
          image: song.image
        }));
        
        setSongs(formattedSongs);
      } catch (error) {
        console.error('Ошибка загрузки песен:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSongs();
  }, []);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        } catch (error) {
          console.error('Ошибка проверки авторизации:', error);
        }
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  // Загружаем избранное
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`/api/user/favorites`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.favorites) {
          setFavoritesList(data.favorites.map((fav: any) => fav.songId));
        }
      })
      .catch(err => console.error('Ошибка загрузки избранного:', err));
  }, []);

  // Проверяем, добавлена ли песня в избранное
  useEffect(() => {
    if (!selectedSong) return;
    setIsFavorite(favoritesList.includes(selectedSong.id));
  }, [selectedSong, favoritesList]);

  const handleSongSelect = (song: GameSong) => {
    if (!user && authChecked) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedSong(song);
    setGameStarted(false);
    setScore(0);
  };

  const startGame = () => {
    if (!user && authChecked) {
      setIsAuthModalOpen(true);
      return;
    }
    if (selectedSong) {
      setGameStarted(true);
      setScore(0);
    }
  };

  const backToMenu = () => {
    setGameStarted(false);
    setSelectedSong(null);
    setScore(0);
  };

  const handleScoreSaved = (isNewRecord: boolean) => {
    if (isNewRecord) {
      setShowNewRecord(true);
      setTimeout(() => setShowNewRecord(false), 3000);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (!selectedSong || !selectedSong.id) {
      console.error('Песня не выбрана или отсутствует ID');
      return;
    }
    
    try {
      if (isFavorite) {
        const res = await fetch(`/api/user/favorites?songId=${selectedSong.id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          setIsFavorite(false);
          setFavoritesList(prev => prev.filter(id => id !== selectedSong.id));
        } else {
          const data = await res.json();
          console.error('Ошибка удаления:', data.error);
        }
      } else {
        const res = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ songId: selectedSong.id })
        });
        
        if (res.ok) {
          setIsFavorite(true);
          setFavoritesList(prev => [...prev, selectedSong.id]);
        } else {
          const data = await res.json();
          console.error('Ошибка добавления:', data.error);
        }
      }
    } catch (error) {
      console.error('Ошибка при работе с избранным:', error);
    }
  };

  // Фильтрация песен
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || song.difficulty === selectedDifficulty;
    const matchesFavorite = !showFavoritesOnly || favoritesList.includes(song.id);
    return matchesSearch && matchesDifficulty && matchesFavorite;
  });

  const difficultyConfig = {
    easy: { label: "Новичок", icon: "🌱", color: "from-green-500 to-green-600", bg: "bg-green-500/10" },
    medium: { label: "Любитель", icon: "⭐", color: "from-yellow-500 to-yellow-600", bg: "bg-yellow-500/10" },
    hard: { label: "Профи", icon: "🔥", color: "from-red-500 to-red-600", bg: "bg-red-500/10" }
  };

  // Стили в зависимости от темы
  const styles = {
    bgPage: isDark ? 'bg-gradient-to-br from-dark via-gray-dark to-darker' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    textPrimary: isDark ? 'text-white' : 'text-gray-800',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
    cardBg: isDark ? 'bg-gray-800/30' : 'bg-white/80',
    cardBorder: isDark ? 'border-gray-700' : 'border-gray-200',
    inputBg: isDark ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800',
    badge: isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600',
  };

  if (loading || !authChecked) {
    return (
      <div className={`min-h-screen ${styles.bgPage} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className={styles.textSecondary}>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (gameStarted && selectedSong) {
    return (
      <div className={`min-h-screen ${styles.bgPage}`}>
        {/* Уведомление о новом рекорде */}
        {showNewRecord && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-full shadow-2xl">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Новый рекорд! 🏆</span>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        )}

        {/* Header */}
        <div className={`${isDark ? 'bg-dark/80 border-primary/20' : 'bg-white/80 border-gray-200'} backdrop-blur-md border-b sticky top-0 z-10`}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={backToMenu}
                  className={`flex items-center gap-2 px-3 py-1.5 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} rounded-lg transition text-sm`}
                >
                  ← Назад
                </button>
                <div>
                  <h2 className={`text-lg font-bold ${styles.textPrimary}`}>{selectedSong.title}</h2>
                  <p className={`text-xs ${styles.textMuted}`}>{selectedSong.artist} • {selectedSong.bpm} BPM</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs ${styles.textMuted}`}>СЧЁТ</div>
                <div className="text-3xl font-bold text-primary">{score}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <GameCanvas 
            song={selectedSong} 
            onScoreUpdate={setScore}
            onScoreSaved={handleScoreSaved}
            key={selectedSong.id}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${styles.bgPage}`}>
        {/* Hero секция */}
        <section className={`relative overflow-hidden pt-12 pb-8 ${isDark ? '' : 'bg-white'}`}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                  <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    Главная
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Игра</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  <span className={`bg-gradient-to-r ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                    Игровой тренажёр
                  </span>
                  <br />
                  <span className="text-gradient">для гитары</span>
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2 max-w-lg`}>
                  Играй в реальном времени, используя микрофон. Следуй за нотами и набирай очки!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'} rounded-full px-4 py-2 border`}>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>🎸 Доступно песен</span>
                  <span className="text-2xl font-bold text-primary ml-2">{filteredSongs.length}</span>
                </div>
                {!user && (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-sm font-medium hover:bg-primary/30 transition-colors flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Войти
                  </button>
                )}
              </div>
            </div>

            {/* Поиск и фильтры */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Поиск песни или исполнителя..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl ${styles.inputBg} focus:outline-none focus:border-primary transition-colors`}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "easy", "medium", "hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedDifficulty === diff
                        ? diff === "easy" ? "bg-green-600 text-white"
                          : diff === "medium" ? "bg-yellow-600 text-white"
                          : diff === "hard" ? "bg-red-600 text-white"
                          : "bg-primary text-white"
                        : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {diff === "all" ? "Все" : diff === "easy" ? "🌱 Новичок" : diff === "medium" ? "⭐ Любитель" : "🔥 Профи"}
                  </button>
                ))}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    showFavoritesOnly
                      ? "bg-primary text-white"
                      : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-white" : ""}`} />
                  Избранное
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Баннер для неавторизованных пользователей */}
        {!user && (
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className={`${isDark ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/20'} rounded-xl p-4 border flex items-center justify-between flex-wrap gap-4`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-full flex items-center justify-center`}>
                  <LogIn className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className={`font-medium ${styles.textPrimary}`}>Для игры необходима авторизация</p>
                  <p className={`text-sm ${styles.textMuted}`}>Войдите или зарегистрируйтесь, чтобы играть и отслеживать прогресс</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                Войти / Регистрация
              </button>
            </div>
          </div>
        )}

        {/* Список песен и детали */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Левая колонка - список песен */}
            <div className="lg:w-80 flex-shrink-0">
              <div className={`${styles.cardBg} backdrop-blur-sm rounded-xl border ${styles.cardBorder} overflow-hidden sticky top-24`}>
                <div className={`p-4 border-b ${styles.cardBorder}`}>
                  <h2 className={`font-bold flex items-center gap-2 ${styles.textPrimary}`}>
                    <Music className="w-5 h-5 text-primary" />
                    БИБЛИОТЕКА ПЕСЕН
                  </h2>
                </div>
                
                <div className="h-[500px] overflow-y-auto custom-scrollbar">
                  {filteredSongs.length === 0 ? (
                    <div className="p-8 text-center">
                      <Music className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-3`} />
                      <p className={styles.textMuted}>Песен не найдено</p>
                    </div>
                  ) : (
                    filteredSongs.map((song) => (
                      <button
                        key={song.id}
                        onClick={() => handleSongSelect(song)}
                        onMouseEnter={() => setHoveredSong(song.id)}
                        onMouseLeave={() => setHoveredSong(null)}
                        className={`
                          w-full text-left p-4 transition-all duration-200 border-l-4
                          ${selectedSong?.id === song.id 
                            ? 'border-primary bg-primary/10' 
                            : hoveredSong === song.id 
                              ? 'border-primary/50 bg-gray-700/30' 
                              : 'border-transparent hover:bg-gray-800/30'
                          }
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className={`font-bold ${styles.textPrimary} flex items-center gap-2`}>
                              {song.title}
                              {favoritesList.includes(song.id) && (
                                <Heart className="w-3 h-3 fill-primary text-primary" />
                              )}
                            </div>
                            <div className={`text-sm ${styles.textMuted}`}>{song.artist}</div>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className={styles.textMuted}>{song.bpm} BPM</span>
                              <span className={`px-2 py-0.5 rounded ${
                                song.difficulty === 'easy' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : song.difficulty === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {difficultyConfig[song.difficulty].icon} {difficultyConfig[song.difficulty].label}
                              </span>
                            </div>
                          </div>
                          <div className="text-primary">
                            {(hoveredSong === song.id || selectedSong?.id === song.id) && (
                              <Play className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Правая колонка - детали песни */}
            <div className="flex-1">
              {selectedSong ? (
                <div className={`${isDark ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' : 'bg-white'} backdrop-blur-sm rounded-xl border ${styles.cardBorder} overflow-hidden`}>
                  <div className={`relative h-48 ${isDark ? 'bg-gradient-to-r from-primary/20 to-purple-500/20' : 'bg-gradient-to-r from-primary/10 to-purple-500/10'}`}>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
                      <div className="text-6xl mb-2">🎸</div>
                      <h2 className="text-2xl font-bold text-white">{selectedSong.title}</h2>
                      <p className="text-gray-300">{selectedSong.artist}</p>
                    </div>
                    <button
                      onClick={toggleFavorite}
                      className={`absolute top-4 right-4 p-2 rounded-lg transition ${
                        isFavorite 
                          ? 'bg-primary/20 text-primary border border-primary/50' 
                          : isDark ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={!user ? 'Войдите в аккаунт' : isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                      disabled={!user}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary' : ''}`} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                        <div className={`text-xs ${styles.textMuted} mb-1`}>ТЕМП</div>
                        <div className={`text-xl font-bold ${styles.textPrimary}`}>{selectedSong.bpm} BPM</div>
                      </div>
                      <div className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                        <div className={`text-xs ${styles.textMuted} mb-1`}>ДЛИТЕЛЬНОСТЬ</div>
                        <div className={`text-xl font-bold ${styles.textPrimary}`}>{Math.floor(selectedSong.duration)} сек</div>
                      </div>
                      <div className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                        <div className={`text-xs ${styles.textMuted} mb-1`}>СЛОЖНОСТЬ</div>
                        <div className={`text-xl font-bold ${
                          selectedSong.difficulty === 'easy' ? 'text-green-400' :
                          selectedSong.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {difficultyConfig[selectedSong.difficulty].icon} {difficultyConfig[selectedSong.difficulty].label}
                        </div>
                      </div>
                      <div className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                        <div className={`text-xs ${styles.textMuted} mb-1`}>НОТ/АККОРДОВ</div>
                        <div className={`text-xl font-bold ${styles.textPrimary}`}>{selectedSong.notes?.length || 0}</div>
                      </div>
                    </div>

                    {selectedSong.startOffset && selectedSong.startOffset > 0 && (
                      <div className="mb-4 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30 text-center">
                        <span className="text-xs text-yellow-400">
                          ⚡ Песня начнётся с {selectedSong.startOffset} секунды (синхронизация)
                        </span>
                      </div>
                    )}

                    <button
                      onClick={startGame}
                      disabled={!user}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        user 
                          ? 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/30 transform hover:scale-[1.02]'
                          : isDark ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Play className="w-5 h-5" />
                      {user ? 'Начать игру' : 'Войдите, чтобы играть'}
                    </button>

                    {!user && (
                      <p className={`text-xs ${styles.textMuted} text-center mt-3`}>
                        🔐 Войдите в аккаунт, чтобы играть и добавлять песни в избранное
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`${styles.cardBg} backdrop-blur-sm rounded-xl border ${styles.cardBorder} p-12 text-center`}>
                  <div className="text-6xl mb-4">🎸</div>
                  <h3 className={`text-xl font-bold ${styles.textPrimary} mb-2`}>ДОБРО ПОЖАЛОВАТЬ!</h3>
                  <p className={styles.textSecondary}>
                    Выбери песню из списка слева,<br/>
                    чтобы начать игру
                  </p>
                  {!user && (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="mt-4 px-5 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Войти для игры
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${isDark ? '#1f1f1f' : '#f1f1f1'};
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e74c3c;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #c0392b;
          }
        `}</style>
      </div>

      {/* Модальное окно авторизации */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLoginSuccess}
      />
    </>
  );
}