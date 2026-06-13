"use client";

import Link from "next/link";
import { 
  ChevronRight, Home, Shield, FileText, Lock, 
  Eye, Database, Cookie, Mail, Phone, MapPin,
  CheckCircle, AlertCircle, ExternalLink, ArrowRight
} from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "28 мая 2026 г.";

  const sections = [
    { id: "general", title: "Общие положения", icon: FileText },
    { id: "data", title: "Какие данные мы собираем", icon: Database },
    { id: "use", title: "Как мы используем данные", icon: Eye },
    { id: "storage", title: "Хранение и защита данных", icon: Lock },
    { id: "cookies", title: "Файлы cookie", icon: Cookie },
    { id: "rights", title: "Права пользователей", icon: CheckCircle },
    { id: "contacts", title: "Контактная информация", icon: Mail },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker">
      {/* Hero секция */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Хлебные крошки */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-300">Политика конфиденциальности</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Защита данных</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Политика конфиденциальности
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Защита ваших персональных данных — наш главный приоритет
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Последнее обновление: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Быстрая навигация */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-5">
            <h2 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Быстрая навигация по документу
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-primary/20 hover:text-primary transition-all duration-200 text-left group"
                >
                  <section.icon className="w-4 h-4 group-hover:text-primary" />
                  <span>{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-8 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            
            {/* 1. Общие положения */}
            <div id="general" className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">1. Общие положения</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки 
                  и защиты персональных данных пользователей веб-приложения <strong className="text-primary">ГитарСинхро</strong> 
                  (далее — «Сайт», «Сервис»).
                </p>
                <p>
                  Используя наш Сервис, вы даёте согласие на обработку ваших персональных данных в соответствии 
                  с настоящей Политикой. Если вы не согласны с условиями Политики, пожалуйста, прекратите использование Сервиса.
                </p>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-sm text-gray-400">
                    📌 Правовое основание: Федеральный закон от 27.07.2006 № 152-ФЗ 
                    «О персональных данных» и иные нормативные правовые акты Российской Федерации в области защиты персональных данных.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Какие данные мы собираем */}
            <div id="data" className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">2. Какие данные мы собираем</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  В процессе использования Сервиса мы можем собирать следующие данные:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="font-semibold text-primary mb-2">📝 Данные, предоставленные вами</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">• Имя и фамилия</li>
                      <li className="flex items-start gap-2">• Адрес электронной почты</li>
                      <li className="flex items-start gap-2">• Контактный телефон</li>
                      <li className="flex items-start gap-2">• Город проживания</li>
                      <li className="flex items-start gap-2">• Аватар (фотография)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="font-semibold text-primary mb-2">📊 Данные, собираемые автоматически</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">• IP-адрес</li>
                      <li className="flex items-start gap-2">• Тип браузера и устройства</li>
                      <li className="flex items-start gap-2">• Данные о прогрессе обучения</li>
                      <li className="flex items-start gap-2">• История тренировок</li>
                      <li className="flex items-start gap-2">• Данные о рекордах и достижениях</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Как мы используем данные */}
            <div id="use" className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">3. Как мы используем данные</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Ваши персональные данные используются для следующих целей:</p>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Предоставление доступа к функциям Сервиса (тюнер, метроном, генератор аккордов)</li>
                  <li>Сохранение и отображение вашего прогресса обучения</li>
                  <li>Отправка уведомлений о новых песнях и аккордах (с вашего согласия)</li>
                  <li>Улучшение качества работы Сервиса и персонализация контента</li>
                  <li>Обработка ваших обращений в службу поддержки</li>
                  <li>Анализ использования Сервиса для его улучшения</li>
                </ul>
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm text-gray-300">
                    📧 <strong className="text-primary">Email-рассылки:</strong> Вы всегда можете отписаться от рассылки, 
                    нажав на ссылку «Отписаться» в любом письме или в настройках профиля.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Хранение и защита данных */}
            <div id="storage" className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">4. Хранение и защита данных</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  Мы принимаем все необходимые организационные и технические меры для защиты ваших персональных 
                  данных от неправомерного доступа, уничтожения, изменения, блокирования и иных неправомерных действий.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Хэширование паролей (bcrypt)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">JWT-токены для авторизации</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">HTTPS-соединение</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Регулярное резервное копирование</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  Срок хранения данных — в течение всего периода использования Сервиса. 
                  Вы можете удалить свой аккаунт в любое время в настройках профиля.
                </p>
              </div>
            </div>

            {/* 5. Файлы cookie */}
            <div id="cookies" className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">5. Файлы cookie</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  Сервис использует файлы cookie для обеспечения корректной работы, персонализации 
                  и анализа использования сайта.
                </p>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="font-semibold text-primary mb-2">🍪 Типы используемых cookie:</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong className="text-white">Обязательные:</strong> необходимы для работы сервиса (авторизация, безопасность)</li>
                    <li><strong className="text-white">Функциональные:</strong> запоминают ваши настройки (тема, избранное)</li>
                    <li><strong className="text-white">Аналитические:</strong> помогают улучшать сервис (анонимная статистика)</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-400">
                  Вы можете отключить cookie в настройках браузера, но это может повлиять на работу некоторых функций Сервиса.
                </p>
              </div>
            </div>

            {/* 6. Права пользователей */}
            <div id="rights" className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">6. Права пользователей</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>В соответствии с законодательством РФ, вы имеете право:</p>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Получить информацию о ваших персональных данных, обработаваемых нами</li>
                  <li>Требовать уточнения, блокирования или уничтожения ваших данных</li>
                  <li>Отозвать согласие на обработку персональных данных</li>
                  <li>Удалить свой аккаунт (в настройках профиля)</li>
                </ul>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm text-yellow-400 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    После удаления аккаунта ваши данные будут удалены без возможности восстановления. 
                    Общий прогресс (рекорды, статистика) будет аннулирован.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Контактная информация */}
            <div id="contacts" className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">7. Контактная информация</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться к нашему 
                  уполномоченному лицу:
                </p>
                <div className="bg-gray-800/50 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Email для обращений:</p>
                      <a href="mailto:guitarsync@yandex.ru" className="text-white hover:text-primary transition-colors">
                        guitarsync@yandex.ru
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Телефон:</p>
                      <a href="tel:+79991234567" className="text-white hover:text-primary transition-colors">
                        +7 (924) 432 33 04
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Юридический адрес:</p>
                      <p className="text-white">г. Санкт-петербург</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Настоящая Политика конфиденциальности является публичным документом. Администрация оставляет 
                  за собой право вносить изменения в Политику с уведомлением пользователей через публикацию 
                  новой версии на Сайте.
                </p>
              </div>
            </div>

            {/* Подпись */}
            <div className="text-center pt-6">
              <div className="border-t border-gray-700 pt-6">
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