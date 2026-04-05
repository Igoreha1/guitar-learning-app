"use client";

import { useState, useEffect } from "react";
import GameCanvas from "@/features/game/GameCanvas";
import { gameSongs } from "@/features/game/songs";
import { GameSong } from "@/features/game/types";

export default function GamePage() {
  const [selectedSong, setSelectedSong] = useState<GameSong | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Проверяем авторизацию при загрузке
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

  // Проверяем, добавлена ли песня в избранное
  useEffect(() => {
    if (!selectedSong) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`/api/user/favorites`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.favorites) {
          const isFav = data.favorites.some((fav: any) => fav.songId === selectedSong.id);
          setIsFavorite(isFav);
        }
      })
      .catch(err => console.error('Ошибка проверки избранного:', err));
  }, [selectedSong]);

  // При клике на песню — показываем её детали справа
  const handleSongSelect = (song: GameSong) => {
    setSelectedSong(song);
    setGameStarted(false);
    setScore(0);
  };

  // Запуск игры из деталей
  const startGame = () => {
    if (selectedSong) {
      setGameStarted(true);
      setScore(0);
    }
  };

  // Возврат в меню из игры
  const backToMenu = () => {
    setGameStarted(false);
    setSelectedSong(null);
    setScore(0);
  };

  // Добавление/удаление из избранного
  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Войдите в аккаунт, чтобы добавлять в избранное');
      return;
    }
    
    try {
      if (isFavorite) {
        // Удаляем из избранного
        const res = await fetch(`/api/user/favorites?songId=${selectedSong?.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setIsFavorite(false);
          alert('Песня удалена из избранного');
        }
      } else {
        // Добавляем в избранное
        const res = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ songId: selectedSong?.id })
        });
        if (res.ok) {
          setIsFavorite(true);
          alert('Песня добавлена в избранное');
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка');
    }
  };

  // Если игра запущена — показываем игровое поле
  if (gameStarted && selectedSong) {
    return (
      <div className="min-h-screen bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          {/* Кнопка назад в меню */}
          <button
            onClick={backToMenu}
            className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            ← ВЕРНУТЬСЯ К ВЫБОРУ ПЕСЕН
          </button>

          {/* Информация о песне */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedSong.title}</h2>
              <p className="text-gray-400">{selectedSong.artist} • {selectedSong.bpm} BPM</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">ТВОЙ СЧЁТ</div>
              <div className="text-3xl font-bold text-red-500">{score}</div>
            </div>
          </div>

          {/* Игровое поле */}
          <GameCanvas 
            song={selectedSong} 
            onScoreUpdate={setScore}
            key={selectedSong.id}
          />

          {/* Инструкция */}
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">🎮 КАК ИГРАТЬ</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-red-500 font-bold mb-2">Управление (клавиши)</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded">A</kbd> — 6-я струна (E)</div>
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded">S</kbd> — 5-я струна (A)</div>
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded">D</kbd> — 4-я струна (D)</div>
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded">F</kbd> — 3-я струна (G)</div>
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded">J</kbd> — 2-я струна (B)</div>
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded">K</kbd> — 1-я струна (E)</div>
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded">ПРОБЕЛ</kbd> — Старт/Стоп</div>
                </div>
              </div>
              <div>
                <h4 className="text-green-500 font-bold mb-2">Аккорды в песне</h4>
                <div className="flex flex-wrap gap-2">
                  {getUniqueChords(selectedSong).map(chord => (
                    <span key={chord} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-white">
                      {chord}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  💡 Для аккордов нужно нажимать все струны одновременно
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Меню выбора песен с деталями справа
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Верхняя панель */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-red-500/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎸</div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  GUITAR<span className="text-red-500">SYNC</span>
                </h1>
                <p className="text-xs text-gray-400">ВЫБЕРИ ПЕСНЮ ДЛЯ ИГРЫ</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">ДОСТУПНО ПЕСЕН</div>
              <div className="text-2xl font-bold text-red-500">{gameSongs.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент: список слева, детали справа */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Левая колонка — список песен */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <span className="text-red-500">🎵</span> БИБЛИОТЕКА ПЕСЕН
                </h2>
              </div>
              
              <div className="h-[600px] overflow-y-auto custom-scrollbar">
                {gameSongs.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleSongSelect(song)}
                    onMouseEnter={() => setHoveredSong(song.id)}
                    onMouseLeave={() => setHoveredSong(null)}
                    className={`
                      w-full text-left p-4 transition-all duration-200 border-l-4
                      ${selectedSong?.id === song.id 
                        ? 'border-red-500 bg-red-500/10' 
                        : hoveredSong === song.id 
                          ? 'border-red-500/50 bg-red-500/5' 
                          : 'border-transparent hover:bg-gray-800/30'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-white">{song.title}</div>
                        <div className="text-sm text-gray-400">{song.artist}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="text-gray-500">{song.bpm} BPM</span>
                          <span className={`px-2 py-0.5 rounded ${
                            song.difficulty === 'easy' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {song.difficulty === 'easy' ? '⭐ НОВИЧОК' : '⭐⭐ ЛЮБИТЕЛЬ'}
                          </span>
                        </div>
                      </div>
                      <div className="text-red-500 text-xl">
                        {hoveredSong === song.id || selectedSong?.id === song.id ? '▶' : ''}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка — детали выбранной песни */}
          <div className="flex-1">
            {selectedSong ? (
              <SongDetails 
                song={selectedSong} 
                onPlay={startGame}
                onClose={() => setSelectedSong(null)}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                isLoggedIn={!!user}
              />
            ) : (
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center">
                <div className="text-6xl mb-4">🎸</div>
                <h3 className="text-xl font-bold text-white mb-2">ДОБРО ПОЖАЛОВАТЬ!</h3>
                <p className="text-gray-400">
                  Выбери песню из списка слева<br/>
                  чтобы увидеть подробную информацию
                </p>
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
  );
}

// Компонент деталей песни (отображается справа)
function SongDetails({ 
  song, 
  onPlay, 
  onClose, 
  isFavorite, 
  onToggleFavorite,
  isLoggedIn 
}: { 
  song: GameSong; 
  onPlay: () => void; 
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isLoggedIn: boolean;
}) {
  const chords = getUniqueChords(song);
  
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      {/* Кнопка закрытия */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition text-xl"
        >
          ✕
        </button>
      </div>
      
      {/* Обложка */}
      <div className="relative h-56 bg-gradient-to-r from-red-900/30 to-purple-900/30 flex items-center justify-center mx-4 rounded-xl">
        <div className="text-8xl opacity-50">🎸</div>
        <div className="absolute bottom-3 right-3 flex gap-2">
          <span className="px-2 py-1 bg-black/60 rounded-full text-xs text-gray-300">
            {song.bpm} BPM
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            song.difficulty === 'easy' 
              ? 'bg-green-500/60 text-white' 
              : 'bg-yellow-500/60 text-white'
          }`}>
            {song.difficulty === 'easy' ? 'ДЛЯ НАЧИНАЮЩИХ' : 'СРЕДНИЙ УРОВЕНЬ'}
          </span>
        </div>
      </div>
      
      {/* Информация */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{song.title}</h2>
            <p className="text-gray-400 text-sm">{song.artist}</p>
          </div>
          
          {/* Кнопка "В избранное" */}
          <button
            onClick={onToggleFavorite}
            className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
              isFavorite 
                ? 'bg-red-600/20 text-red-400 border border-red-500/50' 
                : isLoggedIn 
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700' 
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!isLoggedIn}
            title={!isLoggedIn ? 'Войдите в аккаунт' : isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">ДЛИТЕЛЬНОСТЬ</div>
            <div className="text-xl font-bold text-white">{Math.floor(song.duration)} сек</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">АККОРДОВ</div>
            <div className="text-xl font-bold text-white">{chords.length}</div>
          </div>
        </div>
        
        {/* Аккорды */}
        {chords.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs text-gray-400 mb-2">АККОРДЫ В ПЕСНЕ</h3>
            <div className="flex flex-wrap gap-2">
              {chords.map(chord => (
                <span key={chord} className="px-3 py-1.5 bg-gray-800 rounded-lg text-white font-mono text-sm">
                  {chord}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Кнопка игры */}
        <button
          onClick={onPlay}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition transform hover:scale-105"
        >
          🎸 ИГРАТЬ
        </button>
        
        {/* Подсказка для неавторизованных */}
        {!isLoggedIn && (
          <p className="text-xs text-gray-500 text-center mt-3">
            🔐 Войдите в аккаунт, чтобы добавлять песни в избранное
          </p>
        )}
      </div>
    </div>
  );
}

function getUniqueChords(song: GameSong): string[] {
  const chords = new Set<string>();
  song.notes.forEach(note => {
    if (note.chord) {
      chords.add(note.chord);
    }
  });
  return Array.from(chords);
}