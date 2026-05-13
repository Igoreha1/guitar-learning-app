"use client";

import { useEffect, useRef } from 'react';

interface FretboardProps {
  strings: (number | null)[];
  fingers: (number | null)[];
  name: string;
  width?: number;
  height?: number;
}

const stringNames = ['6', '5', '4', '3', '2', '1'];
const fingerColors: { [key: number]: string } = {
  1: '#3498db',
  2: '#2ecc71',
  3: '#f39c12',
  4: '#9b59b6'
};

export default function Fretboard({ strings, fingers, name, width = 500, height = 450 }: FretboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Находим минимальный зажатый лад (игнорируем null и открытые струны)
    let minFret = 999;
    let maxFret = 0;
    let hasNotes = false;
    
    for (let i = 0; i < strings.length; i++) {
      const fret = strings[i];
      if (fret !== null && fret > 0) {
        hasNotes = true;
        if (fret < minFret) minFret = fret;
        if (fret > maxFret) maxFret = fret;
      }
    }
    
    // Определяем стартовый лад для отображения (показываем 4 лада)
    let startFret = 1;
    if (hasNotes) {
      // Чтобы аккорд был по центру грифа, начинаем на 1-2 лада ниже минимального
      if (minFret <= 3) {
        startFret = 1;
      } else if (minFret <= 5) {
        startFret = 3;
      } else if (minFret <= 7) {
        startFret = 5;
      } else if (minFret <= 9) {
        startFret = 7;
      } else if (minFret <= 11) {
        startFret = 9;
      } else {
        startFret = minFret - 2;
      }
    }
    
    const endFret = startFret + 3; // показываем 4 лада
    
    // Настройки отрисовки
    const padding = { top: 70, bottom: 50, left: 60, right: 40 };
    const stringSpacing = (width - padding.left - padding.right) / 5;
    const fretSpacing = (height - padding.top - padding.bottom) / 4;
    
    // Очистка
    ctx.clearRect(0, 0, width, height);
    
    // Фон
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Декоративная подсветка
    ctx.fillStyle = '#1f1f3a';
    ctx.fillRect(padding.left - 10, padding.top - 10, width - padding.left - padding.right + 20, height - padding.top - padding.bottom + 20);
    
    // Рисуем струны
    for (let i = 0; i < 6; i++) {
      const x = padding.left + i * stringSpacing;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.strokeStyle = i === 0 || i === 5 ? '#e74c3c' : '#c0c0c0';
      ctx.lineWidth = i === 0 || i === 5 ? 2.5 : 1.5;
      ctx.stroke();
    }
    
    // Рисуем лады (4 лада)
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + i * fretSpacing;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.strokeStyle = '#888';
      ctx.lineWidth = i === 0 ? 2 : 1;
      ctx.stroke();
    }
    
    // Номера ладов (динамические)
    for (let i = 0; i < 4; i++) {
      const fretNumber = startFret + i;
      const y = padding.top + (i + 0.8) * fretSpacing;
      ctx.fillStyle = '#aaa';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(fretNumber.toString(), padding.left - 28, y);
    }
    
    // Метка стартового лада
    if (startFret > 1) {
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`${startFret} лад`, padding.left + 15, padding.top - 12);
    }
    
    // Верхний порожек
    ctx.fillStyle = '#b08d57';
    ctx.fillRect(padding.left - 5, padding.top - 8, width - padding.left - padding.right + 10, 6);
    
    // Названия струн
    for (let i = 0; i < 6; i++) {
      const x = padding.left + i * stringSpacing;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(stringNames[i], x - 5, padding.top - 14);
    }
    
    // Рисуем точки (пальцы) — ТОЛЬКО в видимой области
    for (let string = 0; string < 6; string++) {
      const fret = strings[string];
      if (fret === null) continue;
      
      const x = padding.left + string * stringSpacing;
      
      if (fret === 0) {
        // Открытая струна
        ctx.beginPath();
        ctx.arc(x, padding.top - 22, 9, 0, 2 * Math.PI);
        ctx.fillStyle = '#2ecc71';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('○', x - 5, padding.top - 18);
      } else if (fret >= startFret && fret <= endFret) {
        // Зажатая струна в видимой области
        const fretIndex = fret - startFret;
        const y = padding.top + (fretIndex + 0.5) * fretSpacing;
        const finger = fingers[string];
        
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, 2 * Math.PI);
        ctx.fillStyle = finger && fingerColors[finger] ? fingerColors[finger] : '#e74c3c';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, 2 * Math.PI);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        if (finger) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 16px monospace';
          ctx.fillText(finger.toString(), x - 6, y + 6);
        }
      }
    }
    
    // Баррэ
    let barreStart = -1;
    let barreEnd = -1;
    let barreFret = null;
    
    for (let i = 0; i < 6; i++) {
      if (fingers[i] === 1 && strings[i] !== null && strings[i]! > 0) {
        if (barreStart === -1) {
          barreStart = i;
          barreFret = strings[i];
        } else if (strings[i] === barreFret) {
          barreEnd = i;
        }
      }
    }
    
    if (barreStart !== -1 && barreEnd > barreStart && barreFret !== null && barreFret >= startFret && barreFret <= endFret) {
      const fretIndex = barreFret - startFret;
      const y = padding.top + (fretIndex + 0.5) * fretSpacing;
      const startX = padding.left + barreStart * stringSpacing;
      const endX = padding.left + barreEnd * stringSpacing;
      
      ctx.beginPath();
      ctx.moveTo(startX - 8, y);
      ctx.lineTo(endX + 8, y);
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(startX - 8, y);
      ctx.lineTo(endX + 8, y);
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
      ctx.lineWidth = 8;
      ctx.stroke();
      
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('баррэ', (startX + endX) / 2 - 22, y - 8);
    }
    
  }, [strings, fingers, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg shadow-xl"
      style={{ background: '#1a1a2e' }}
    />
  );
}