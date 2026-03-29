"use client";

import Tuner from "@/features/tuner/Tuner";
import Link from "next/link";
import { useState } from "react";

export default function TunerPage() {
  const [showCelebration, setShowCelebration] = useState(false);

  const handleTuneComplete = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        {/* Хлебные крошки */}
        <div className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-red-600 transition">
            ← На главную
          </Link>
        </div>

        {/* Тюнер */}
        <Tuner onTuneComplete={handleTuneComplete} />

        {/* Поздравление */}
        {showCelebration && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            🎉 Отлично! Гитара настроена! 🎸
          </div>
        )}
      </div>
    </div>
  );
}