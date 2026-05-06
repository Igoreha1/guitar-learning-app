"use client";

import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Trash2, Play, Pause } from 'lucide-react';

interface Note {
  id: string;
  string: number;
  fret: number;
  time: number;
  duration: number;
}

interface PianoRollEditorProps {
  notes: Note[];
  onChange: (notes: Note[]) => void;
  bpm?: number;
  height?: number;
  audioUrl?: string;
}

const stringNames = ['6-я (E)', '5-я (A)', '4-я (D)', '3-я (G)', '2-я (B)', '1-я (E)'];
const stringColors = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'
];

export default function PianoRollEditor({ notes, onChange, bpm = 120, height = 500, audioUrl }: PianoRollEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [zoom, setZoom] = useState(50);
  const [offset, setOffset] = useState(0);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, noteStartTime: 0, noteStartString: 0 });
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [audioDuration, setAudioDuration] = useState(0);
  const animationRef = useRef<number | null>(null);

  const NOTES_AREA_X = 80;
  const stringHeight = (height - 80) / 6;
  const pxPerSecond = zoom;
  
  // Определяем максимальную длительность из нот и аудио
  const maxNoteTime = Math.max(...notes.map(n => n.time + n.duration), 0);
  const totalDuration = Math.max(60, maxNoteTime + 5, audioDuration + 5); // минимум 60 секунд

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.clientWidth - 20);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      // Получаем длительность аудио
      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setAudioDuration(audioRef.current.duration);
        }
      };
    }
  }, [audioUrl]);

  const getTimeFromX = (clientX: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return -1;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const canvasX = (clientX - rect.left) * scaleX;
    const notesAreaX = NOTES_AREA_X * scaleX;
    
    if (canvasX < notesAreaX) return -1;
    const time = offset + (canvasX - notesAreaX) / pxPerSecond / scaleX;
    return Math.max(0, Math.min(totalDuration, time));
  };

  const getStringFromY = (clientY: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return -1;
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    const canvasY = (clientY - rect.top) * scaleY;
    const stringIndex = Math.floor((canvasY - 50) / stringHeight);
    return Math.max(0, Math.min(5, stringIndex));
  };

  const getNoteAtPosition = (clientX: number, clientY: number): Note | null => {
    const time = getTimeFromX(clientX);
    const stringIndex = getStringFromY(clientY);
    if (time < 0 || stringIndex < 0) return null;
    
    return notes.find(n => 
      n.string === stringIndex && 
      time >= n.time && 
      time <= n.time + n.duration
    ) || null;
  };

  const addNote = (time: number, stringIndex: number) => {
    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random()}`,
      string: stringIndex,
      fret: 0,
      time: Math.max(0, time),
      duration: 0.5
    };
    onChange([...notes, newNote]);
    setSelectedNote(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    onChange(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id: string) => {
    onChange(notes.filter(n => n.id !== id));
    if (selectedNote === id) setSelectedNote(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const note = getNoteAtPosition(e.clientX, e.clientY);
    
    if (note) {
      setSelectedNote(note.id);
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX, 
        y: e.clientY,
        noteStartTime: note.time,
        noteStartString: note.string
      });
    } else {
      const time = getTimeFromX(e.clientX);
      const stringIndex = getStringFromY(e.clientY);
      if (time >= 0 && stringIndex >= 0) {
        addNote(time, stringIndex);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && selectedNote) {
      const deltaTime = getTimeFromX(e.clientX) - getTimeFromX(dragStart.x);
      const deltaString = getStringFromY(e.clientY) - getStringFromY(dragStart.y);
      
      const noteToMove = notes.find(n => n.id === selectedNote);
      if (noteToMove) {
        updateNote(selectedNote, {
          time: Math.max(0, dragStart.noteStartTime + deltaTime),
          string: Math.max(0, Math.min(5, dragStart.noteStartString + deltaString))
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const startPlayback = () => {
    setIsPlaying(true);
    setPlayhead(offset);
    if (audioRef.current) {
      audioRef.current.currentTime = offset;
      audioRef.current.play();
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setPlayhead(offset);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = offset;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const startPlayhead = playhead;
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newPlayhead = startPlayhead + elapsed;
        
        if (newPlayhead >= totalDuration) {
          stopPlayback();
        } else {
          setPlayhead(newPlayhead);
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const updatePlayheadFromAudio = () => {
      if (isPlaying && audioRef.current) {
        setPlayhead(audioRef.current.currentTime);
      }
    };
    
    const interval = setInterval(updatePlayheadFromAudio, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvasWidth;
    canvas.width = width;
    canvas.height = height;
    
    const notesAreaWidth = width - NOTES_AREA_X - 20;
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(NOTES_AREA_X, 0, notesAreaWidth, height);
    
    for (let i = 0; i <= 6; i++) {
      const y = 50 + i * stringHeight;
      ctx.beginPath();
      ctx.moveTo(NOTES_AREA_X, y);
      ctx.lineTo(NOTES_AREA_X + notesAreaWidth, y);
      ctx.strokeStyle = i === 0 || i === 6 ? '#e74c3c' : '#333';
      ctx.lineWidth = i === 0 || i === 6 ? 2 : 1;
      ctx.stroke();
    }
    
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = stringColors[i];
      ctx.font = 'bold 11px monospace';
      ctx.fillText(stringNames[i], NOTES_AREA_X - 50, 50 + i * stringHeight + stringHeight / 2 + 4);
      ctx.fillStyle = stringColors[i];
      ctx.fillRect(NOTES_AREA_X - 20, 50 + i * stringHeight + stringHeight / 2 - 4, 12, 8);
    }
    
    const startTime = Math.floor(offset);
    const endTime = Math.ceil(offset + notesAreaWidth / pxPerSecond);
    for (let time = startTime; time <= endTime; time += 0.5) {
      const x = NOTES_AREA_X + (time - offset) * pxPerSecond;
      if (x < NOTES_AREA_X || x > NOTES_AREA_X + notesAreaWidth) continue;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = time % 1 === 0 ? '#4a4a5a' : '#2a2a3a';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      if (time % 1 === 0) {
        ctx.fillStyle = '#888';
        ctx.font = '10px monospace';
        ctx.fillText(`${time}с`, x + 2, 25);
      }
    }
    
    notes.forEach(note => {
      const x = NOTES_AREA_X + (note.time - offset) * pxPerSecond;
      const y = 50 + note.string * stringHeight;
      const noteWidth = note.duration * pxPerSecond;
      
      if (x + noteWidth < NOTES_AREA_X || x > NOTES_AREA_X + notesAreaWidth) return;
      
      const isSelected = selectedNote === note.id;
      const isHovered = hoveredNote === note.id;
      const color = stringColors[note.string];
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y + 4, noteWidth, stringHeight - 8);
      
      ctx.strokeStyle = isSelected ? '#fff' : isHovered ? '#ff0' : '#000';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(x, y + 4, noteWidth, stringHeight - 8);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px monospace';
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'black';
      ctx.fillText(note.fret.toString(), x + 4, y + stringHeight / 2 + 4);
      ctx.shadowBlur = 0;
    });
    
    if (isPlaying) {
      const playheadX = NOTES_AREA_X + (playhead - offset) * pxPerSecond;
      if (playheadX >= NOTES_AREA_X && playheadX <= NOTES_AREA_X + notesAreaWidth) {
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('▶', playheadX - 4, 20);
      }
    }
    
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.strokeRect(NOTES_AREA_X, 0, notesAreaWidth, height);
  };
  
  useEffect(() => {
    draw();
  }, [notes, offset, zoom, selectedNote, hoveredNote, isPlaying, playhead, canvasWidth]);
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden" ref={containerRef}>
      <div className="bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setZoom(Math.max(10, zoom - 10))}
            className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition"
            title="Уменьшить"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition"
            title="Увеличить"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <button
            type="button"
            onClick={() => setOffset(Math.max(0, offset - 2))}
            className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setOffset(offset + 2)}
            className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            →
          </button>
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <button
            type="button"
            onClick={startPlayback}
            disabled={isPlaying}
            className="p-1.5 bg-green-600 rounded hover:bg-green-500 transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={stopPlayback}
            disabled={!isPlaying}
            className="p-1.5 bg-yellow-600 rounded hover:bg-yellow-500 transition disabled:opacity-50"
          >
            <Pause className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetPlayback}
            className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            ⏹
          </button>
        </div>
        <div className="text-xs text-gray-400">zoom: {zoom}px/сек | offset: {offset.toFixed(1)}с</div>
      </div>
      
      {audioUrl && (
        <div className="bg-gray-800/50 p-2 border-b border-gray-700">
          <audio ref={audioRef} controls className="w-full" />
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, cursor: 'crosshair' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {selectedNote && (
        <div className="bg-gray-800 p-3 border-t border-gray-700 flex gap-4 items-center flex-wrap">
          <div className="text-sm text-gray-400">Редактирование ноты:</div>
          <div className="flex gap-3 flex-wrap">
            <div>
              <label className="text-xs text-gray-500">Струна</label>
              <select
                value={notes.find(n => n.id === selectedNote)?.string || 0}
                onChange={(e) => updateNote(selectedNote, { string: parseInt(e.target.value) })}
                className="ml-2 px-2 py-1 bg-gray-700 rounded text-white text-sm"
              >
                {stringNames.map((name, i) => (
                  <option key={i} value={i}>{i + 1}-я</option>
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
            <div>
              <label className="text-xs text-gray-500">Время (с)</label>
              <input
                type="number"
                step="0.1"
                value={notes.find(n => n.id === selectedNote)?.time.toFixed(1) || 0}
                onChange={(e) => updateNote(selectedNote, { time: parseFloat(e.target.value) })}
                className="ml-2 px-2 py-1 bg-gray-700 rounded text-white text-sm w-20"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Длит. (с)</label>
              <input
                type="number"
                step="0.1"
                value={notes.find(n => n.id === selectedNote)?.duration.toFixed(1) || 0}
                onChange={(e) => updateNote(selectedNote, { duration: parseFloat(e.target.value) })}
                className="ml-2 px-2 py-1 bg-gray-700 rounded text-white text-sm w-20"
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
      
      <div className="bg-gray-800/50 p-2 flex justify-center gap-4 text-xs border-t border-gray-700">
        <span className="text-gray-400">💡 Клик на поле — добавить ноту</span>
        <span className="text-gray-400">🖱️ Перетаскивание — переместить ноту</span>
        <span className="text-gray-400">🎨 Цвет = струна</span>
        <span className="text-gray-400">🔢 Цифра = лад</span>
      </div>
    </div>
  );
}