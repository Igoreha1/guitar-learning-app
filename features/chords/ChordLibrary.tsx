"use client";

import { useState } from 'react';
import { chords, chordCategories, Chord } from './chordsData';
import ChordDiagram from './ChordDiagram';
import { getChordPlayer } from './ChordPlayer';

export default function ChordLibrary() {
  const [selectedChord, setSelectedChord] = useState<Chord>(chords[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMode, setPlayMode] = useState<'chord' | 'arpeggio' | 'rhythm'>('chord');

  const chordPlayer = getChordPlayer();

  const handlePlayChord = async () => {
    if (isPlaying) {
      chordPlayer.stopChord();
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    
    try {
      if (playMode === 'chord') {
        await chordPlayer.playChord(selectedChord.name, 2);
      } else if (playMode === 'arpeggio') {
        await chordPlayer.playArpeggio(selectedChord.name, 0.15);
      } else if (playMode === 'rhythm') {
        await chordPlayer.playRhythmPattern(selectedChord.name);
      }
      
      // Автоматически сбрасываем состояние после окончания
      setTimeout(() => setIsPlaying(false), 2000);
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      setIsPlaying(false);
    }
  };

  const filteredChords = chordCategories
    .find(c => c.name === selectedCategory)?.chords || chords;
  
  const searchedChords = filteredChords.filter(chord =>
    chord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chord.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Заголовок */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          🎸 Аккордовая библиотека
        </h1>
        <p className="text-gray-600 text-lg">
          Изучайте аккорды с визуальными схемами и слушайте их звучание
        </p>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Поиск аккорда (Am, C, Dm...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {chordCategories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat.name
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({cat.chords.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Левая колонка - визуализация */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">{selectedChord.name}</h2>
              <p className="text-gray-500">{selectedChord.fullName}</p>
            </div>
            
            <ChordDiagram
              strings={selectedChord.strings}
              fingers={selectedChord.fingers}
              name={selectedChord.name}
            />
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{selectedChord.description}</p>
            </div>

            {/* Выбор режима воспроизведения */}
            <div className="mt-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setPlayMode('chord')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    playMode === 'chord'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🎵 Аккорд
                </button>
                <button
                  onClick={() => setPlayMode('arpeggio')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    playMode === 'arpeggio'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🎸 Арпеджио
                </button>
                <button
                  onClick={() => setPlayMode('rhythm')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    playMode === 'rhythm'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🥁 Ритм
                </button>
              </div>
            </div>
            
            <button
              onClick={handlePlayChord}
              className={`w-full mt-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                isPlaying
                  ? 'bg-gray-500 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
              }`}
              disabled={isPlaying}
            >
              {isPlaying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Играет...
                </>
              ) : (
                <>
                  🔊 Послушать аккорд
                  {playMode === 'arpeggio' && ' (арпеджио)'}
                  {playMode === 'rhythm' && ' (ритм)'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Правая колонка - список аккордов */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Аккорды • {searchedChords.length}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {searchedChords.map((chord, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedChord(chord)}
                  className={`
                    p-4 rounded-lg text-center transition-all duration-200
                    ${selectedChord.name === chord.name
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'
                    }
                  `}
                >
                  <div className="text-2xl font-bold">{chord.name}</div>
                  <div className="text-xs opacity-80">{chord.fullName}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Советы по аккордам */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Совет по аккорду {selectedChord.name}</h4>
            <p className="text-sm text-blue-700">
              {selectedChord.name === 'F' && 'Аккорд F требует баррэ — прижми указательным пальцем все струны на первом ладу.'}
              {selectedChord.name === 'G' && 'Для аккорда G можно использовать мизинец на 6-й струне, это поможет легче переходить к другим аккордам.'}
              {selectedChord.name === 'Am' && 'Аккорд Am — отличная база для многих песен. Следи, чтобы открытые струны звучали чисто.'}
              {selectedChord.name === 'C' && 'Аккорд C — один из первых, которые учат новички. Убедись, что 3-я струна не глушится.'}
              {selectedChord.name === 'Em' && 'Аккорд Em — самый простой. Всего два пальца!'}
              {!['F', 'G', 'Am', 'C', 'Em'].includes(selectedChord.name) && 'Убедись, что пальцы не касаются соседних струн. Каждая струна должна звучать чисто.'}
            </p>
          </div>

          {/* Информация о воспроизведении */}
          <div className="mt-4 text-center text-xs text-gray-500">
            💡 Совет: нажмите на аккорд, чтобы выбрать его. Используйте кнопки "Аккорд", "Арпеджио" или "Ритм" для разного звучания
          </div>
        </div>
      </div>
    </div>
  );
}