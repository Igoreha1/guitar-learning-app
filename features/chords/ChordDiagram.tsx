"use client";

import { useEffect, useRef } from 'react';

interface ChordDiagramProps {
  strings: (number | null)[];
  fingers: (number | null)[];
  name: string;
  width?: number;
  height?: number;
}

// Названия струн
const stringNames = ['6', '5', '4', '3', '2', '1'];

export default function ChordDiagram({ strings, fingers, name, width = 300, height = 350 }: ChordDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Настройки
    const padding = { top: 40, bottom: 40, left: 35, right: 35 };
    const stringSpacing = (width - padding.left - padding.right) / 5;
    const fretSpacing = (height - padding.top - padding.bottom) / 4;
    
    // Очистка
    ctx.clearRect(0, 0, width, height);
    
    // Фон
    ctx.fillStyle = '#faf9f5';
    ctx.fillRect(0, 0, width, height);
    
    // Рисуем вертикальные линии (струны)
    for (let i = 0; i < 6; i++) {
      const x = padding.left + i * stringSpacing;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = i === 0 || i === 5 ? 1.5 : 1;
      ctx.stroke();
    }
    
    // Рисуем горизонтальные линии (лады)
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + i * fretSpacing;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.strokeStyle = '#888';
      ctx.lineWidth = i === 0 ? 2 : 1;
      ctx.stroke();
    }
    
    // Номер лада у верхнего порожка
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.fillText('1', padding.left - 15, padding.top + fretSpacing / 2);
    ctx.fillText('2', padding.left - 15, padding.top + fretSpacing * 1.5);
    ctx.fillText('3', padding.left - 15, padding.top + fretSpacing * 2.5);
    ctx.fillText('4', padding.left - 15, padding.top + fretSpacing * 3.5);
    
    // Названия струн
    for (let i = 0; i < 6; i++) {
      const x = padding.left + i * stringSpacing;
      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      ctx.fillText(stringNames[i], x - 4, padding.top - 8);
    }
    
    // Рисуем точки (пальцы)
    for (let string = 0; string < 6; string++) {
      const fret = strings[string];
      if (fret === null || fret === 0) {
        // Открытая струна
        if (fret === 0) {
          const x = padding.left + string * stringSpacing;
          ctx.beginPath();
          ctx.arc(x, padding.top - 12, 6, 0, 2 * Math.PI);
          ctx.fillStyle = '#2ecc71';
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('○', x - 3, padding.top - 8);
        }
        continue;
      }
      
      if (fret >= 1 && fret <= 4) {
        const x = padding.left + string * stringSpacing;
        const y = padding.top + (fret - 0.5) * fretSpacing;
        const finger = fingers[string];
        
        // Рисуем точку
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = finger ? getFingerColor(finger) : '#e74c3c';
        ctx.fill();
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        
        // Номер пальца
        if (finger) {
          ctx.fillStyle = 'white';
          ctx.font = 'bold 14px monospace';
          ctx.shadowBlur = 0;
          ctx.fillText(finger.toString(), x - 5, y + 5);
        }
      }
    }
    
    // Рисуем баррэ (если нужно)
    const barreStrings = findBarre(strings, fingers);
    if (barreStrings) {
      const y = padding.top + (barreStrings.fret - 0.5) * fretSpacing;
      const startX = padding.left + barreStrings.start * stringSpacing;
      const endX = padding.left + barreStrings.end * stringSpacing;
      
      ctx.beginPath();
      ctx.moveTo(startX - 5, y);
      ctx.lineTo(endX + 5, y);
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('баррэ', (startX + endX) / 2 - 15, y - 8);
    }
    
  }, [strings, fingers, width, height]);

  const getFingerColor = (finger: number): string => {
    const colors: { [key: number]: string } = {
      1: '#3498db', // указательный
      2: '#2ecc71', // средний
      3: '#f39c12', // безымянный
      4: '#9b59b6'  // мизинец
    };
    return colors[finger] || '#e74c3c';
  };

  const findBarre = (strings: (number | null)[], fingers: (number | null)[]): { fret: number; start: number; end: number } | null => {
    let barreFret: number | null = null;
    let start = -1;
    let end = -1;
    
    for (let i = 0; i < 6; i++) {
      if (fingers[i] === 1 && strings[i] && strings[i]! > 0) {
        if (barreFret === null) {
          barreFret = strings[i];
          start = i;
        } else if (strings[i] === barreFret) {
          end = i;
        } else if (strings[i] !== barreFret) {
          return null;
        }
      }
    }
    
    if (barreFret !== null && end > start) {
      return { fret: barreFret, start, end };
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg shadow-lg"
        style={{ background: '#faf9f5' }}
      />
      <div className="flex gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>1 - указательный</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>2 - средний</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span>3 - безымянный</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span>4 - мизинец</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>○ - открытая</span></div>
      </div>
    </div>
  );
}