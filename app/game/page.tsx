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
  
  // Проверка авторизации
  if (!token) {
    setIsAuthModalOpen(true);
    return;
  }
  
  // Проверка, что выбранная песня существует
  if (!selectedSong || !selectedSong.id) {
    console.error('Песня не выбрана или отсутствует ID');
    return;
  }
  
  console.log('Toggling favorite for song:', selectedSong.id, 'Current isFavorite:', isFavorite);
  
  try {
    if (isFavorite) {
      // Удаляем из избранного
      const res = await fetch(`/api/user/favorites?songId=${selectedSong.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('DELETE response status:', res.status);
      
      if (res.ok) {
        setIsFavorite(false);
        setFavoritesList(prev => prev.filter(id => id !== selectedSong.id));
        console.log('Успешно удалено из избранного');
      } else {
        const data = await res.json();
        console.error('Ошибка удаления:', data.error);
      }
    } else {
      // Добавляем в избранное
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ songId: selectedSong.id })
      });
      
      console.log('POST response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(true);
        setFavoritesList(prev => [...prev, selectedSong.id]);
        console.log('Успешно добавлено в избранное');
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

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (gameStarted && selectedSong) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker">
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
        <div className="bg-dark/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={backToMenu}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-gray-300 text-sm"
                >
                  ← Назад
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedSong.title}</h2>
                  <p className="text-xs text-gray-400">{selectedSong.artist} • {selectedSong.bpm} BPM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">СЧЁТ</div>
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
      <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker">
        {/* Hero секция */}
        <section className="relative overflow-hidden pt-12 pb-8">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    Главная
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-300">Игра</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Игровой тренажёр
                  </span>
                  <br />
                  <span className="text-gradient">для гитары</span>
                </h1>
                <p className="text-gray-400 mt-2 max-w-lg">
                  Играй в реальном времени, используя микрофон. Следуй за нотами и набирай очки!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700">
                  <span className="text-sm text-gray-400">🎸 Доступно песен</span>
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Поиск песни или исполнителя..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex gap-2">
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
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
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
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
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
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-medium">Для игры необходима авторизация</p>
                  <p className="text-sm text-gray-400">Войдите или зарегистрируйтесь, чтобы играть и отслеживать прогресс</p>
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
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-700">
                  <h2 className="text-white font-bold flex items-center gap-2">
                    <Music className="w-5 h-5 text-primary" />
                    БИБЛИОТЕКА ПЕСЕН
                  </h2>
                </div>
                
                <div className="h-[500px] overflow-y-auto custom-scrollbar">
                  {filteredSongs.length === 0 ? (
                    <div className="p-8 text-center">
                      <Music className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Песен не найдено</p>
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
                            <div className="font-bold text-white flex items-center gap-2">
                              {song.title}
                              {favoritesList.includes(song.id) && (
                                <Heart className="w-3 h-3 fill-primary text-primary" />
                              )}
                            </div>
                            <div className="text-sm text-gray-400">{song.artist}</div>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className="text-gray-500">{song.bpm} BPM</span>
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
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 text-center">
                      <div className="text-6xl mb-2">🎸</div>
                      <h2 className="text-2xl font-bold text-white">{selectedSong.title}</h2>
                      <p className="text-gray-300">{selectedSong.artist}</p>
                    </div>
                    <button
                      onClick={toggleFavorite}
                      className={`absolute top-4 right-4 p-2 rounded-lg transition ${
                        isFavorite 
                          ? 'bg-primary/20 text-primary border border-primary/50' 
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                      }`}
                      title={!user ? 'Войдите в аккаунт' : isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                      disabled={!user}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary' : ''}`} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">ТЕМП</div>
                        <div className="text-xl font-bold text-white">{selectedSong.bpm} BPM</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">ДЛИТЕЛЬНОСТЬ</div>
                        <div className="text-xl font-bold text-white">{Math.floor(selectedSong.duration)} сек</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">СЛОЖНОСТЬ</div>
                        <div className={`text-xl font-bold ${
                          selectedSong.difficulty === 'easy' ? 'text-green-400' :
                          selectedSong.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {difficultyConfig[selectedSong.difficulty].icon} {difficultyConfig[selectedSong.difficulty].label}
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">НОТ/АККОРДОВ</div>
                        <div className="text-xl font-bold text-white">{selectedSong.notes?.length || 0}</div>
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
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Play className="w-5 h-5" />
                      {user ? 'Начать игру' : 'Войдите, чтобы играть'}
                    </button>

                    {!user && (
                      <p className="text-xs text-gray-500 text-center mt-3">
                        🔐 Войдите в аккаунт, чтобы играть и добавлять песни в избранное
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-12 text-center">
                  <div className="text-6xl mb-4">🎸</div>
                  <h3 className="text-xl font-bold text-white mb-2">ДОБРО ПОЖАЛОВАТЬ!</h3>
                  <p className="text-gray-400">
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
            background: #1f1f1f;
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