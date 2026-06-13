"use client";

import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Trash2, Play, Pause, Clock } from 'lucide-react';
import { beatsToSeconds, secondsToBeats, type TabNote } from '@/utils/noteConverter';

interface TabEditorProps {
  notes: TabNote[];
  onChange: (notes: TabNote[]) => void;
  bpm?: number;
  height?: number;
  audioUrl?: string;
  title?: string;
  timeSignature?: [number, number];
  startOffset?: number;
}

const stringNames = ['6 (E)', '5 (A)', '4 (D)', '3 (G)', '2 (B)', '1 (E)'];
const stringColors = [
  '#e74c3c', // 6 струна (красный)
  '#e67e22', // 5 струна (оранжевый)
  '#f1c40f', // 4 струна (жёлтый)
  '#2ecc71', // 3 струна (зелёный)
  '#3498db', // 2 струна (синий)
  '#9b59b6'  // 1 струна (фиолетовый)
];

const SUB_DIVISIONS = 4;

export default function TabEditor({ 
  notes, 
  onChange, 
  bpm = 120, 
  height = 600, 
  audioUrl, 
  title,
  timeSignature = [4, 4],
  startOffset = 0
}: TabEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(100);
  const [startMeasure, setStartMeasure] = useState(1);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadMeasure, setPlayheadMeasure] = useState(1);
  const [playheadBeat, setPlayheadBeat] = useState(1);
  const [playheadSubBeat, setPlayheadSubBeat] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0, noteId: '' });
  const [currentOffset, setCurrentOffset] = useState(startOffset);

  const LINE_HEIGHT = 45;
  const MEASURE_WIDTH = 160 * (zoom / 100);
  const BEAT_WIDTH = MEASURE_WIDTH / timeSignature[0];
  const SUB_BEAT_WIDTH = BEAT_WIDTH / SUB_DIVISIONS;
  const TOTAL_HEIGHT = 6 * LINE_HEIGHT + 80;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.clientWidth - 100);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    setCurrentOffset(startOffset);
  }, [startOffset]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) setAudioDuration(audioRef.current.duration);
      };
    }
  }, [audioUrl]);

  // Правильное определение позиции мыши на грифе
  const getMousePosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleX;
    
    const measure = startMeasure + Math.floor(canvasX / MEASURE_WIDTH);
    const beatInMeasure = Math.floor((canvasX % MEASURE_WIDTH) / BEAT_WIDTH);
    const beat = Math.min(beatInMeasure + 1, timeSignature[0]);
    const subBeat = Math.floor(((canvasX % MEASURE_WIDTH) % BEAT_WIDTH) / SUB_BEAT_WIDTH);
    
    // Определяем струну: верхняя часть (маленький Y) = 6-я струна (индекс 0)
    // Нижняя часть (большой Y) = 1-я струна (индекс 5)
    const rawString = Math.floor((canvasY - 40) / LINE_HEIGHT);
    const string = Math.min(5, Math.max(0, rawString));
    
    if (string < 0 || string > 5 || measure < 1 || beat < 1) return null;
    return { measure, beat, subBeat, string, canvasX, canvasY };
  };

  const getNoteAt = (clientX: number, clientY: number) => {
    const pos = getMousePosition(clientX, clientY);
    if (!pos) return null;
    
    const index = notes.findIndex(n => 
      n.string === pos.string &&
      n.measure === pos.measure &&
      n.beat === pos.beat &&
      n.subBeat === pos.subBeat
    );
    
    if (index === -1) return null;
    return { note: notes[index], index };
  };

  const addNote = (measure: number, beat: number, subBeat: number, string: number) => {
    const time = beatsToSeconds(measure, beat, subBeat, bpm, timeSignature);
    const newNote: TabNote = {
      id: `note_${Date.now()}_${Math.random()}`,
      string,
      fret: 0,
      time,
      beat,
      subBeat,
      measure,
      duration: 0.5
    };
    onChange([...notes, newNote].sort((a, b) => {
      if (a.measure !== b.measure) return a.measure - b.measure;
      if (a.beat !== b.beat) return a.beat - b.beat;
      return a.subBeat - b.subBeat;
    }));
    setSelectedNote(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<TabNote>) => {
    onChange(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id: string) => {
    onChange(notes.filter(n => n.id !== id));
    if (selectedNote === id) setSelectedNote(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const hit = getNoteAt(e.clientX, e.clientY);
    if (hit) {
      setSelectedNote(hit.note.id);
      setIsDragging(true);
      setDragStartPos({ x: e.clientX, y: e.clientY, noteId: hit.note.id });
    } else {
      const pos = getMousePosition(e.clientX, e.clientY);
      if (pos && pos.measure >= 1 && pos.beat >= 1) {
        addNote(pos.measure, pos.beat, pos.subBeat, pos.string);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const hit = getNoteAt(e.clientX, e.clientY);
    setHoveredNote(hit?.note.id || null);
    
    if (isDragging && dragStartPos.noteId) {
      const pos = getMousePosition(e.clientX, e.clientY);
      if (pos) {
        updateNote(dragStartPos.noteId, {
          measure: pos.measure,
          beat: pos.beat,
          subBeat: pos.subBeat,
          string: pos.string,
          time: beatsToSeconds(pos.measure, pos.beat, pos.subBeat, bpm, timeSignature)
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvasWidth;
    canvas.width = width;
    canvas.height = TOTAL_HEIGHT;
    
    // Фон
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, TOTAL_HEIGHT);
    
    // Отрисовка струн (сверху вниз: 6→5→4→3→2→1)
    for (let i = 0; i < 6; i++) {
      const y = 40 + i * LINE_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = stringColors[i];
      ctx.lineWidth = i === 0 || i === 5 ? 2 : 1;
      ctx.stroke();
      ctx.fillStyle = stringColors[i];
      ctx.font = 'bold 11px monospace';
      ctx.fillText(stringNames[i], 5, y - 5);
    }
    
    const measuresShown = Math.ceil(width / MEASURE_WIDTH) + 1;
    
    // Отрисовка тактов и долей
    for (let i = 0; i <= measuresShown; i++) {
      const measure = startMeasure + i;
      const x = i * MEASURE_WIDTH;
      if (x > width) continue;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, TOTAL_HEIGHT - 30);
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(measure.toString(), x + 4, 25);
      
      for (let beat = 1; beat <= timeSignature[0]; beat++) {
        const beatX = x + beat * BEAT_WIDTH;
        
        if (beat < timeSignature[0]) {
          ctx.beginPath();
          ctx.moveTo(beatX, 0);
          ctx.lineTo(beatX, TOTAL_HEIGHT - 30);
          ctx.strokeStyle = '#4a4a5a';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        for (let sub = 1; sub < SUB_DIVISIONS; sub++) {
          const subX = x + (beat - 1) * BEAT_WIDTH + sub * SUB_BEAT_WIDTH;
          ctx.beginPath();
          ctx.moveTo(subX, 0);
          ctx.lineTo(subX, TOTAL_HEIGHT - 30);
          ctx.strokeStyle = '#2a2a3a';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        
        ctx.fillStyle = '#666';
        ctx.font = '9px monospace';
        ctx.fillText(beat.toString(), x + (beat - 1) * BEAT_WIDTH + 2, 15);
      }
    }
    
    // Отрисовка нот
    notes.forEach(note => {
      if (note.measure < startMeasure || note.measure > startMeasure + measuresShown) return;
      
      const x = (note.measure - startMeasure) * MEASURE_WIDTH + 
                (note.beat - 1) * BEAT_WIDTH + 
                note.subBeat * SUB_BEAT_WIDTH;
      const y = 40 + note.string * LINE_HEIGHT + LINE_HEIGHT / 2 - 10;
      const noteWidth = SUB_BEAT_WIDTH * 2;
      
      const isSelected = selectedNote === note.id;
      const isHovered = hoveredNote === note.id;
      const color = stringColors[note.string];
      
      ctx.fillStyle = color;
      ctx.shadowBlur = isSelected ? 6 : 0;
      ctx.shadowColor = color;
      ctx.fillRect(x, y, noteWidth, 20);
      
      ctx.strokeStyle = isSelected ? '#fff' : isHovered ? '#ff0' : '#000';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, noteWidth, 20);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(note.fret.toString(), x + 4, y + 14);
      ctx.shadowBlur = 0;
    });
    
    // Отрисовка курсора воспроизведения
    if (isPlaying) {
      const x = (playheadMeasure - startMeasure) * MEASURE_WIDTH + 
                (playheadBeat - 1) * BEAT_WIDTH + 
                playheadSubBeat * SUB_BEAT_WIDTH;
      if (x >= 0 && x <= width) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, TOTAL_HEIGHT - 30);
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('▼', x - 3, 25);
      }
    }
  };
  
  useEffect(() => {
    draw();
  }, [notes, startMeasure, zoom, selectedNote, hoveredNote, isPlaying, playheadMeasure, playheadBeat, canvasWidth]);
  
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const interval = setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          const pos = secondsToBeats(currentTime - currentOffset, bpm, timeSignature);
          setPlayheadMeasure(pos.measure);
          setPlayheadBeat(pos.beat);
          setPlayheadSubBeat(pos.subBeat);
          if (currentTime >= audioDuration) {
            setIsPlaying(false);
          }
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isPlaying, bpm, currentOffset]);
  
  const startPlayback = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = currentOffset;
      audioRef.current.play();
    }
  };
  
  const stopPlayback = () => {
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  };
  
  const resetPlayback = () => {
    setIsPlaying(false);
    setPlayheadMeasure(startMeasure);
    setPlayheadBeat(1);
    setPlayheadSubBeat(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = currentOffset;
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden" ref={containerRef}>
      <div className="bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
        <div className="flex gap-2">
          <button type="button" onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <button type="button" onClick={() => setStartMeasure(Math.max(1, startMeasure - 4))} className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition">
            ← Такт
          </button>
          <button type="button" onClick={() => setStartMeasure(startMeasure + 4)} className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition">
            Такт →
          </button>
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <button type="button" onClick={startPlayback} disabled={isPlaying} className="p-1.5 bg-green-600 rounded hover:bg-green-500 transition disabled:opacity-50">
            <Play className="w-4 h-4" />
          </button>
          <button type="button" onClick={stopPlayback} disabled={!isPlaying} className="p-1.5 bg-yellow-600 rounded hover:bg-yellow-500 transition disabled:opacity-50">
            <Pause className="w-4 h-4" />
          </button>
          <button type="button" onClick={resetPlayback} className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition">
            ⏹
          </button>
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Смещение: {currentOffset.toFixed(1)}с</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {title && <span className="mr-3">{title}</span>}
          Такт {startMeasure} | {timeSignature[0]}/{timeSignature[1]} | {bpm} BPM | 16-е ноты
        </div>
      </div>
      
      {audioUrl && (
        <div className="bg-gray-800/50 p-2 border-b border-gray-700">
          <audio ref={audioRef} controls className="w-full" />
        </div>
      )}
      
      <div className="overflow-auto" style={{ height: height, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: TOTAL_HEIGHT, cursor: 'crosshair' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {selectedNote && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 p-3 border-t border-gray-700 flex gap-4 items-center flex-wrap">
            <div className="text-sm text-gray-400">Редактирование ноты:</div>
            <div className="flex gap-3 flex-wrap">
              <div>
                <label className="text-xs text-gray-500">Такт</label>
                <input
                  type="number"
                  min="1"
                  value={notes.find(n => n.id === selectedNote)?.measure || 1}
                  onChange={(e) => {
                    const newMeasure = parseInt(e.target.value);
                    const note = notes.find(n => n.id === selectedNote);
                    if (note) {
                      updateNote(selectedNote, { 
                        measure: newMeasure,
                        time: beatsToSeconds(newMeasure, note.beat, note.subBeat, bpm, timeSignature)
                      });
                    }
                  }}
                  className="ml-2 px-2 py-1 bg-gray-700 rounded text-white text-sm w-20"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Доля</label>
                <input
                  type="number"
                  min="1"
                  max={timeSignature[0]}
                  value={notes.find(n => n.id === selectedNote)?.beat || 1}
                  onChange={(e) => {
                    const newBeat = parseInt(e.target.value);
                    const note = notes.find(n => n.id === selectedNote);
                    if (note) {
                      updateNote(selectedNote, { 
                        beat: newBeat,
                        time: beatsToSeconds(note.measure, newBeat, note.subBeat, bpm, timeSignature)
                      });
                    }
                  }}
                  className="ml-2 px-2 py-1 bg-gray-700 rounded text-white text-sm w-20"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Позиция</label>
                <select
                  value={notes.find(n => n.id === selectedNote)?.subBeat || 0}
                  onChange={(e) => {
                    const newSubBeat = parseInt(e.target.value);
                    const note = notes.find(n => n.id === selectedNote);
                    if (note) {
                      updateNote(selectedNote, { 
                        subBeat: newSubBeat,
                        time: beatsToSeconds(note.measure, note.beat, newSubBeat, bpm, timeSignature)
                      });
                    }
                  }}
                  className="ml-2 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                >
                  <option value={0}>1-я 16-я (начало)</option>
                  <option value={1}>2-я 16-я</option>
                  <option value={2}>3-я 16-я</option>
                  <option value={3}>4-я 16-я</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Струна</label>
                <select
                  value={notes.find(n => n.id === selectedNote)?.string || 0}
                  onChange={(e) => updateNote(selectedNote, { string: parseInt(e.target.value) })}
                  className="ml-2 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                >
                  {stringNames.map((name, i) => (
                    <option key={i} value={i}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Лад</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={notes.find(n => n.id === selectedNote)?.fret || 0}
                  onChange={(e) => updateNote(selectedNote, { fret: parseInt(e.target.value) })}
                  className="ml-2 px-2 py-1 bg-gray-700 rounded text-white text-sm w-16"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteNote(selectedNote)}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition flex items-center gap-1 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Удалить
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-800/50 p-2 flex justify-center gap-4 text-xs border-t border-gray-700">
        <span className="text-gray-400">🎸 Клик на поле — добавить ноту (16-я)</span>
        <span className="text-gray-400">📝 Выберите ноту — редактируйте параметры</span>
        <span className="text-gray-400">🎨 Цвет = струна</span>
        <span className="text-gray-400">🔢 Цифра = лад</span>
        <span className="text-gray-400">📏 Сетка 16-х нот</span>
      </div>
    </div>
  );
}