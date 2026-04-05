"use client";

import { useState } from 'react';
import Fretboard from './Fretboard';
import { notes, chordTypes, getChordByNoteAndType, ChordShape } from './chordsData';

export default function ChordGenerator() {
  const [selectedNote, setSelectedNote] = useState('C');
  const [selectedType, setSelectedType] = useState('Major');
  const [currentChord, setCurrentChord] = useState<ChordShape>(getChordByNoteAndType('C', 'Major'));
  const [showFingerHint, setShowFingerHint] = useState(false);

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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎸 Генератор аккордов
        </h1>
        <p className="text-gray-600">
          Выберите ноту и тип аккорда — получите аппликатуру на грифе
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Левая панель - выбор */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Выбор аккорда</h2>
            
            {/* Выбор ноты */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Основная нота
              </label>
              <div className="grid grid-cols-4 gap-2">
                {notes.map((note) => (
                  <button
                    key={note.name}
                    onClick={() => updateChord(note.name, selectedType)}
                    className={`py-2 rounded-lg font-bold transition ${
                      selectedNote === note.name
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {note.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Выбор типа аккорда */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип аккорда
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {chordTypes.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => updateChord(selectedNote, type.name)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                      selectedType === type.name
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.name}
                    <span className="text-xs ml-1 text-gray-500">{type.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Инфо */}
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600">
                <span className="font-bold">Текущий аккорд:</span>
                <span className="ml-2 text-xl font-bold text-red-600">
                  {getChordFullName()}
                </span>
              </div>
              {currentChord.description && (
                <p className="text-xs text-gray-500 mt-2">{currentChord.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Правая панель - визуализация */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Аппликатура {getChordFullName()}
              </h2>
              <button
                onClick={() => setShowFingerHint(!showFingerHint)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showFingerHint ? 'Скрыть подсказки' : 'Показать пальцы'}
              </button>
            </div>

            <div className="flex justify-center">
              <Fretboard
                strings={currentChord.strings}
                fingers={showFingerHint ? currentChord.fingers : currentChord.strings.map(() => null)}
                name={currentChord.name}
                width={450}
                height={450}
              />
            </div>

            {/* Легенда */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>1 — указательный</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>2 — средний</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span>3 — безымянный</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span>4 — мизинец</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>○ — открытая струна</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <span>⊗ — не играть</span>
              </div>
            </div>

            {/* Схема струн */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Схема зажатия:</h3>
              <div className="space-y-1 text-sm font-mono">
                {currentChord.strings.map((fret, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="w-16 text-gray-500">{idx + 1}-я струна:</span>
                    {fret === null && <span className="text-red-500">⊗ не играть</span>}
                    {fret === 0 && <span className="text-green-500">○ открытая</span>}
                    {fret && fret > 0 && (
                      <span>
                        зажать на <span className="font-bold text-blue-600">{fret}</span> ладу
                        {currentChord.fingers[idx] && (
                          <span className="text-gray-500 ml-2">
                            (палец {currentChord.fingers[idx]})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Советы */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Совет:</h4>
              <p className="text-sm text-blue-700">
                Нажмите "Показать пальцы", чтобы увидеть, каким пальцем зажимать каждый лад.
                Цифры соответствуют пальцам: 1-указательный, 2-средний, 3-безымянный, 4-мизинец.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}