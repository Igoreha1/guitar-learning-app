"use client";

import Link from "next/link";
import { ChevronRight, Home, Guitar } from "lucide-react";
import ChordGenerator from "@/features/chords/ChordGenerator";

export default function ChordGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker">
      {/* Hero секция — адаптирована под светлую тему */}
      <section className="relative overflow-hidden pt-16 pb-8 bg-gradient-to-br from-gray-dark/30 via-gray-dark/20 to-dark/30">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Хлебные крошки */}
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-primary">Генератор аккордов</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
              <Guitar className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Интерактивный справочник</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-text-primary">
                Генератор аккордов
              </span>
              <br />
              <span className="text-gradient">для гитары</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Выберите ноту и тип аккорда — получите аппликатуру на грифе с подсказками для пальцев
            </p>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <ChordGenerator />
        </div>
      </section>
    </div>
  );
}