"use client";

import { useState, useEffect } from 'react';
import Fretboard from './Fretboard';
import { notes, chordTypes, getChordByNoteAndType, ChordShape, getAllChords } from './chordsData';
import { Search, ChevronDown, ChevronUp, Guitar, Music, Sparkles, Heart, Star, Volume2, Info, Fingerprint } from 'lucide-react';

export default function ChordGenerator() {
  const [selectedNote, setSelectedNote] = useState('C');
  const [selectedType, setSelectedType] = useState('Major');
  const [currentChord, setCurrentChord] = useState<ChordShape>(getChordByNoteAndType('C', 'Major'));
  const [showFingerHint, setShowFingerHint] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllChords, setShowAllChords] = useState(false);
  const [favoriteChords, setFavoriteChords] = useState<string[]>([]);

  // Загрузка избранного из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorite_chords');
    if (saved) {
      setFavoriteChords(JSON.parse(saved));
    }
  }, []);

  const updateChord = (note: string, type: string) => {
    const chord = getChordByNoteAndType(note, type);
    setCurrentChord(chord);
    setSelectedNote(note);
    setSelectedType(type);
  };

  const getChordFullName = () => {
    const typeObj = chordTypes.find(t => t.name === selectedType);
    const suffix = typeObj?.suffix || '';
    return `${selectedNote}${suffix}`;
  };

  const toggleFavorite = (chordKey: string) => {
    const newFavorites = favoriteChords.includes(chordKey)
      ? favoriteChords.filter(f => f !== chordKey)
      : [...favoriteChords, chordKey];
    setFavoriteChords(newFavorites);
    localStorage.setItem('favorite_chords', JSON.stringify(newFavorites));
  };

  const isFavorite = favoriteChords.includes(`${selectedNote}${selectedType}`);

  const filteredChordTypes = chordTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allChordsList = getAllChords();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero секция */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-4">
          <Guitar className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">Интерактивный справочник</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Генератор аккордов
          </span>
          <br />
          <span className="text-gradient">для гитары</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Выберите ноту и тип аккорда — получите аппликатуру на грифе с подсказками для пальцев
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Левая панель - выбор */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Поиск */}
            <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl border border-gray-800 p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Поиск аккорда (C, Dm, G7...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Выбор ноты */}
            <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl border border-gray-800 p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                Основная нота
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {notes.map((note) => (
                  <button
                    key={note.name}
                    onClick={() => updateChord(note.name, selectedType)}
                    className={`py-2.5 rounded-xl font-bold transition-all duration-200 ${
                      selectedNote === note.name
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {note.name}
                    <span className="text-xs ml-0.5 opacity-70">{note.accidental}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Выбор типа аккорда */}
            <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl border border-gray-800 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-primary" />
                  Тип аккорда
                </h2>
                <button
                  onClick={() => setShowAllChords(!showAllChords)}
                  className="text-xs text-gray-400 hover:text-primary transition-colors"
                >
                  {showAllChords ? 'Свернуть' : 'Показать все'}
                </button>
              </div>
              
              <div className={`grid grid-cols-2 gap-2 transition-all duration-300 ${showAllChords ? 'max-h-96 overflow-y-auto' : 'max-h-48 overflow-y-auto'}`}>
                {(showAllChords ? filteredChordTypes : filteredChordTypes.slice(0, 12)).map((type) => (
                  <button
                    key={type.name}
                    onClick={() => updateChord(selectedNote, type.name)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                      selectedType === type.name
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span>{type.name}</span>
                    <span className="text-xs ml-1 opacity-70">{type.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Инфо и избранное */}
            <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl border border-gray-800 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm text-gray-500">Текущий аккорд</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                    {getChordFullName()}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(`${selectedNote}${selectedType}`)}
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
              
              {currentChord.description && (
                <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-800/50 rounded-lg">
                  {currentChord.description}
                </p>
              )}

              {/* Часто используемые аккорды */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Часто ищут:
                </div>
                <div className="flex flex-wrap gap-2">
                  {['C', 'G', 'D', 'Am', 'Em', 'F'].map((popular) => (
                    <button
                      key={popular}
                      onClick={() => {
                        const note = popular.replace(/m$/, '');
                        const type = popular.includes('m') ? 'Minor' : 'Major';
                        updateChord(note, type);
                      }}
                      className="px-3 py-1 text-xs bg-gray-800 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      {popular}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель - визуализация */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl border border-gray-800 p-6">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Аппликатура <span className="text-gradient">{getChordFullName()}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">Схема зажатия на грифе гитары</p>
              </div>
              <button
                onClick={() => setShowFingerHint(!showFingerHint)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl text-sm text-gray-300 hover:bg-primary/20 hover:text-primary transition-all duration-200"
              >
                {showFingerHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showFingerHint ? 'Скрыть пальцы' : 'Показать пальцы'}
              </button>
            </div>

            {/* Гриф */}
            <div className="flex justify-center py-4">
              <Fretboard
                strings={currentChord.strings}
                fingers={showFingerHint ? currentChord.fingers : currentChord.strings.map(() => null)}
                name={currentChord.name}
                width={500}
                height={450}
              />
            </div>

            {/* Легенда */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">1 — указательный</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">2 — средний</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-300">3 — безымянный</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-300">4 — мизинец</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-gray-300">○ — открытая</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-gray-300">⊗ — не играть</span>
              </div>
            </div>

            {/* Схема струн */}
            <div className="mt-6 p-5 bg-gray-800/30 rounded-xl border border-gray-700">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Схема зажатия:
              </h3>
              <div className="space-y-2 text-sm">
                {currentChord.strings.map((fret, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="w-24 text-gray-400 font-mono">{idx + 1}-я струна:</div>
                    {fret === null && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white">⊗</div>
                        <span className="text-gray-500">не играть</span>
                      </div>
                    )}
                    {fret === 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-xs text-white">○</div>
                        <span className="text-green-400">открытая струна</span>
                      </div>
                    )}
                    {fret && fret > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-primary text-lg">{fret}</span>
                        <span className="text-gray-400">лад</span>
                        {currentChord.fingers[idx] && (
                          <span className="flex items-center gap-1 ml-2">
                            <div 
                              className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                              style={{
                                background: currentChord.fingers[idx] === 1 ? '#3b82f6' :
                                           currentChord.fingers[idx] === 2 ? '#22c55e' :
                                           currentChord.fingers[idx] === 3 ? '#f97316' : '#a855f7'
                              }}
                            >
                              {currentChord.fingers[idx]}
                            </div>
                            <span className="text-gray-500 text-xs">палец</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Советы и звук */}
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Совет по зажатию:
                </h4>
                <p className="text-sm text-gray-300">
                  {currentChord.tip || 'Прижимайте струны ближе к ладовому порожку для чистого звучания. Пальцы ставьте вертикально.'}
                </p>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  Альтернативные аппликатуры:
                </h4>
                <p className="text-sm text-gray-400">
                  Этот аккорд можно также зажать на других позициях грифа.
                  Попробуйте использовать баррэ для более насыщенного звучания.
                </p>
              </div>
            </div>
          </div>

          {/* Рекомендуемые аккорды */}
          <div className="mt-6 bg-gradient-to-br from-gray-dark/30 to-dark/30 rounded-2xl border border-gray-800 p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Рекомендуемые аккорды
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'C Major', chord: 'C' },
                { name: 'G Major', chord: 'G' },
                { name: 'D Major', chord: 'D' },
                { name: 'A Minor', chord: 'Am' },
                { name: 'E Minor', chord: 'Em' },
                { name: 'F Major', chord: 'F' }
              ].map((rec) => (
                <button
                  key={rec.chord}
                  onClick={() => {
                    const note = rec.chord.replace(/m$/, '');
                    const type = rec.chord.includes('m') ? 'Minor' : 'Major';
                    updateChord(note, type);
                  }}
                  className="px-4 py-2 bg-gray-800 rounded-xl text-sm text-gray-300 hover:bg-primary/20 hover:text-primary transition-all duration-200"
                >
                  {rec.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}