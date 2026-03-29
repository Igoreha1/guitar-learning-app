"use client";

import React, { useEffect, useRef } from 'react';
import { TabNote } from './tabTypes';

interface TabViewerProps {
  tabs: TabNote[];
  currentTime: number;
  width?: number;
  height?: number;
}

// Названия струн
const stringNames = ['E (6)', 'A (5)', 'D (4)', 'G (3)', 'B (2)', 'E (1)'];

// Цвета для пальцев
const fingerColors: { [key: number]: string } = {
  1: '#3498db', // указательный
  2: '#2ecc71', // средний
  3: '#f39c12', // безымянный
  4: '#9b59b6', // мизинец
};

export default function TabViewer({ tabs, currentTime, width = 600, height = 250 }: TabViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Настройки
    const padding = { left: 50, right: 30, top: 30, bottom: 30 };
    const stringSpacing = (height - padding.top - padding.bottom) / 5;
    
    // Очистка
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Рисуем линии струн
    for (let i = 0; i < 6; i++) {
      const y = padding.top + i * stringSpacing;
      
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.strokeStyle = i === 0 || i === 5 ? '#e74c3c' : '#444';
      ctx.lineWidth = i === 0 || i === 5 ? 2 : 1;
      ctx.stroke();
      
      // Названия струн
      ctx.fillStyle = '#888';
      ctx.font = '12px monospace';
      ctx.fillText(stringNames[i], padding.left - 35, y + 4);
    }
    
    // Находим ноты в текущем окне (±1.5 секунды)
    const timeWindow = 1.5;
    const visibleTabs = tabs.filter(tab => 
      Math.abs(tab.time - currentTime) <= timeWindow
    );
    
    // Рисуем ноты
    visibleTabs.forEach(tab => {
      const stringIndex = tab.string;
      const y = padding.top + stringIndex * stringSpacing;
      
      // Позиция по X в зависимости от времени
      const timeOffset = (tab.time - currentTime) / timeWindow;
      const x = width - padding.right - (timeOffset + 1) * 150;
      
      if (x < padding.left - 30 || x > width - padding.right + 30) return;
      
      // Рисуем ноту
      const radius = 18;
      
      // Градиент
      const gradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
      if (tab.chord) {
        gradient.addColorStop(0, '#ff00aa');
        gradient.addColorStop(1, '#aa00ff');
      } else if (tab.finger) {
        gradient.addColorStop(0, fingerColors[tab.finger]);
        gradient.addColorStop(1, `${fingerColors[tab.finger]}cc`);
      } else {
        gradient.addColorStop(0, '#e74c3c');
        gradient.addColorStop(1, '#c0392b');
      }
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Обводка
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Текст (лад или аккорд)
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px monospace';
      const text = tab.chord || (tab.fret === 0 ? '○' : tab.fret.toString());
      ctx.fillText(text, x - 8, y + 6);
      
      // Номер пальца (если есть)
      if (tab.finger && tab.fret > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(tab.finger.toString(), x + 10, y - 8);
      }
    });
    
    // Рисуем линию текущего времени
    const nowX = width - padding.right - 30;
    ctx.beginPath();
    ctx.moveTo(nowX, padding.top - 10);
    ctx.lineTo(nowX, height - padding.bottom + 10);
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Метка "Сейчас"
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('СЕЙЧАС', nowX - 25, padding.top - 5);
    
  }, [tabs, currentTime, width, height]);
  
  return React.createElement(
    'div',
    { className: 'bg-gray-900 rounded-lg p-4' },
    React.createElement(
      'h3',
      { className: 'text-white text-sm mb-2 flex items-center gap-2' },
      React.createElement('span', { className: 'text-red-500' }, '🎸'),
      ' ТАБУЛАТУРА',
      React.createElement('span', { className: 'text-xs text-gray-500 ml-2' }, '(ноты движутся справа налево)')
    ),
    React.createElement('canvas', {
      ref: canvasRef,
      width: width,
      height: height,
      className: 'w-full rounded-lg',
      style: { background: '#1a1a2e' }
    }),
    React.createElement(
      'div',
      { className: 'flex gap-4 mt-3 text-xs' },
      React.createElement('div', { className: 'flex items-center gap-1' },
        React.createElement('div', { className: 'w-3 h-3 rounded-full bg-blue-500' }),
        React.createElement('span', { className: 'text-gray-400' }, '1 - указательный')
      ),
      React.createElement('div', { className: 'flex items-center gap-1' },
        React.createElement('div', { className: 'w-3 h-3 rounded-full bg-green-500' }),
        React.createElement('span', { className: 'text-gray-400' }, '2 - средний')
      ),
      React.createElement('div', { className: 'flex items-center gap-1' },
        React.createElement('div', { className: 'w-3 h-3 rounded-full bg-orange-500' }),
        React.createElement('span', { className: 'text-gray-400' }, '3 - безымянный')
      ),
      React.createElement('div', { className: 'flex items-center gap-1' },
        React.createElement('div', { className: 'w-3 h-3 rounded-full bg-purple-500' }),
        React.createElement('span', { className: 'text-gray-400' }, '4 - мизинец')
      ),
      React.createElement('div', { className: 'flex items-center gap-1' },
        React.createElement('div', { className: 'w-3 h-3 rounded-full bg-red-500' }),
        React.createElement('span', { className: 'text-gray-400' }, '○ - открытая')
      )
    )
  );
}