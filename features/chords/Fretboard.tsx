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

export default function Fretboard({ strings, fingers, name, width = 350, height = 400 }: FretboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = { top: 50, bottom: 40, left: 40, right: 30 };
    const stringSpacing = (width - padding.left - padding.right) / 5;
    const fretSpacing = (height - padding.top - padding.bottom) / 4;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Рисуем струны
    for (let i = 0; i < 6; i++) {
      const x = padding.left + i * stringSpacing;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.strokeStyle = i === 0 || i === 5 ? '#e74c3c' : '#888';
      ctx.lineWidth = i === 0 || i === 5 ? 2 : 1;
      ctx.stroke();
    }

    // Рисуем лады
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + i * fretSpacing;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = i === 0 ? 2 : 1;
      ctx.stroke();
    }

    // Номера ладов
    for (let i = 1; i <= 4; i++) {
      const y = padding.top + i * fretSpacing;
      ctx.fillStyle = '#888';
      ctx.font = '12px monospace';
      ctx.fillText(i.toString(), padding.left - 20, y - 5);
    }

    // Названия струн
    for (let i = 0; i < 6; i++) {
      const x = padding.left + i * stringSpacing;
      ctx.fillStyle = '#aaa';
      ctx.font = '10px monospace';
      ctx.fillText(stringNames[i], x - 4, padding.top - 8);
    }

    // Рисуем точки (пальцы)
    for (let string = 0; string < 6; string++) {
      const fret = strings[string];
      if (fret === null) continue;

      const x = padding.left + string * stringSpacing;

      if (fret === 0) {
        // Открытая струна
        ctx.beginPath();
        ctx.arc(x, padding.top - 15, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#2ecc71';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('○', x - 4, padding.top - 11);
      } else if (fret >= 1 && fret <= 4) {
        // Зажатая струна
        const y = padding.top + (fret - 0.5) * fretSpacing;
        const finger = fingers[string];

        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = finger && fingerColors[finger] ? fingerColors[finger] : '#e74c3c';
        ctx.fill();
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';

        if (finger) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(finger.toString(), x - 5, y + 5);
        }
        ctx.shadowBlur = 0;
      }
    }

    // Баррэ
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
      ctx.fillText('баррэ', (startX + endX) / 2 - 20, y - 8);
    }

  }, [strings, fingers, width, height]);

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
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg shadow-lg"
      style={{ background: '#1a1a2e' }}
    />
  );
}