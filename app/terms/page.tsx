"use client";

import Link from "next/link";
import { ChevronRight, Home, FileText, Shield, AlertCircle, Mail, CheckCircle } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "28 мая 2026 г.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker">
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-300">Пользовательское соглашение</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Правовая информация</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Пользовательское соглашение
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Правила использования сервиса ГитарСинхро
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Последнее обновление: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <p className="text-sm">
                  ⚠️ Используя веб-приложение <strong className="text-primary">ГитарСинхро</strong>, 
                  вы соглашаетесь с условиями настоящего Пользовательского соглашения. 
                  Если вы не согласны, пожалуйста, прекратите использование сервиса.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">1</span>
                  Общие положения
                </h2>
                <p>
                  1.1. ГитарСинхро (далее — «Сервис») предоставляет инструменты для обучения игре на гитаре: 
                  тюнер, метроном, генератор аккордов, библиотеку песен и игровой тренажёр.
                </p>
                <p className="mt-2">
                  1.2. Сервис предназначен для лиц старше 14 лет. Использование сервиса несовершеннолетними 
                  допускается только с согласия родителей или законных представителей.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">2</span>
                  Права и обязанности пользователя
                </h2>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Предоставлять достоверную информацию при регистрации</li>
                  <li>Не передавать свои учётные данные третьим лицам</li>
                  <li>Не использовать сервис для незаконных целей</li>
                  <li>Уважать права других пользователей</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">3</span>
                  Интеллектуальная собственность
                </h2>
                <p>
                  Все материалы, размещённые на Сайте (за исключением контента, загруженного пользователями), 
                  являются объектами авторского права. Копирование, распространение и иное использование 
                  материалов без письменного разрешения запрещено.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">4</span>
                  Ограничение ответственности
                </h2>
                <p>
                  Сервис предоставляется «как есть». Администрация не гарантирует непрерывную работу сервиса 
                  и не несёт ответственности за возможные сбои, вызванные обстоятельствами непреодолимой силы 
                  или действиями третьих лиц.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">5</span>
                  Изменение условий
                </h2>
                <p>
                  Администрация оставляет за собой право изменять условия соглашения. Новая версия вступает 
                  в силу с момента публикации на Сайте.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">6</span>
                  Контакты
                </h2>
                <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                  <p>📧 <strong>Email:</strong> <a href="mailto:guitarsync@yandex.ru" className="text-primary hover:underline">guitarsync@yandex.ru</a></p>
                  <p>📞 <strong>Телефон:</strong> <a href="tel:+79991234567" className="text-primary hover:underline">+7 (924) 432 33 04</a></p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6 mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} ГитарСинхро. Все права защищены.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}