"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, Home, Guitar, Music, Heart, 
  Users, Target, Zap, Shield, Award, Sparkles,
  Star, TrendingUp, Clock, Headphones, Mic, 
  BookOpen, Gamepad2, Smile, CheckCircle,
  ArrowRight, Mail, Phone, MapPin
} from "lucide-react";

export default function AboutPage() {
  const [isDark, setIsDark] = useState(true);

  // Следим за изменением темы
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    { name: "Игорь", role: "Разработчик и основатель", icon: "🎸", bio: "Гитарист с 10-летним стажем, создатель проекта" },
  ];

  const features = [
    { icon: Mic, title: "Точный тюнер", description: "Настройка гитары через микрофон с точностью до цента", color: "from-red-500 to-red-600" },
    { icon: Headphones, title: "Умный метроном", description: "Настройка темпа от 40 до 208 BPM с визуальной анимацией", color: "from-orange-500 to-orange-600" },
    { icon: BookOpen, title: "Генератор аккордов", description: "Более 100 аккордов с визуализацией на грифе", color: "from-green-500 to-green-600" },
    { icon: Gamepad2, title: "Игровой тренажёр", description: "Изучайте песни в интерактивном режиме с оценкой точности", color: "from-purple-500 to-purple-600" },
    { icon: TrendingUp, title: "Отслеживание прогресса", description: "Статистика, рекорды и система достижений", color: "from-blue-500 to-blue-600" },
    { icon: Heart, title: "Избранное", description: "Сохраняйте любимые песни и аккорды", color: "from-pink-500 to-pink-600" },
  ];

  const stats = [
    { value: "100+", label: "Аккордов", icon: Guitar },
    { value: "50+", label: "Популярных песен", icon: Music },
    { value: "100%", label: "Бесплатно", icon: Heart },
    { value: "24/7", label: "Доступность", icon: Clock },
  ];

  // Стили в зависимости от темы
  const styles = {
    bgPage: isDark ? 'bg-gradient-to-br from-dark via-gray-dark to-darker' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
    cardBg: isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-white/80 border-gray-200',
    cardBgHover: isDark ? 'hover:border-primary/30' : 'hover:border-primary/30',
    cardBgInner: isDark ? 'bg-gray-800/50' : 'bg-gray-50',
  };

  return (
    <div className={`min-h-screen ${styles.bgPage}`}>
      {/* Hero секция */}
      <section className="relative overflow-hidden pt-20 pb-12">
        {/* Анимированные лучи */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Хлебные крошки */}
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>О проекте</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
              <Guitar className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">О нас</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className={`bg-gradient-to-r ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                О проекте
              </span>
              <br />
              <span className="text-gradient">ГитарСинхро</span>
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-2xl mx-auto`}>
              Бесплатный самоучитель игры на гитаре, созданный с любовью к музыке
            </p>
          </div>
        </div>
      </section>

      {/* Миссия */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`${isDark ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30' : 'bg-white'} rounded-2xl border ${styles.cardBg} p-8 text-center`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-2xl mb-4`}>
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className={`text-2xl md:text-3xl font-bold ${styles.textPrimary} mb-4`}>Наша миссия</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg max-w-3xl mx-auto leading-relaxed`}>
              Сделать обучение игре на гитаре <span className="text-primary font-semibold">доступным, понятным и увлекательным</span> для каждого. 
              Мы верим, что музыка — это язык, который объединяет людей, а гитара — идеальный инструмент, 
              чтобы начать своё музыкальное путешествие.
            </p>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 text-center border hover:border-primary/30 transition-all group`}>
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className={`text-3xl font-bold ${styles.textPrimary}`}>{stat.value}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Что мы предлагаем */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold ${styles.textPrimary} mb-3`}>Что мы предлагаем</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto`}>
              Все необходимые инструменты для обучения игре на гитаре в одном месте
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border hover:border-primary/30 transition-all group`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold ${styles.textPrimary} mb-2`}>{feature.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Почему мы */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={`${isDark ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 'bg-primary/5'} rounded-2xl p-6 border border-primary/20`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className={`text-lg font-semibold ${styles.textPrimary}`}>Почему GuitarSync?</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>✅ <strong>Полностью бесплатно</strong> — никаких скрытых платежей</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>🎸 <strong>Реальное обучение</strong> — играйте на своей гитаре через микрофон</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>📊 <strong>Отслеживание прогресса</strong> — видите свои успехи</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>🎮 <strong>Игровой формат</strong> — учитесь с удовольствием</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>🆓 <strong>Без рекламы</strong> — ничто не отвлекает от занятий</span>
                </li>
              </ul>
            </div>
            
            <div className={`${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className={`text-lg font-semibold ${styles.textPrimary}`}>Для кого этот сайт?</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs">1</div>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}><strong>Начинающих гитаристов</strong> — которые только берут гитару в руки</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs">2</div>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}><strong>Любителей</strong> — кто хочет расширить свой репертуар</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs">3</div>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}><strong>Опытных музыкантов</strong> — для разминки и изучения новых песен</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs">4</div>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}><strong>Преподавателей</strong> — как дополнительный инструмент для учеников</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold ${styles.textPrimary} mb-3`}>Наша команда</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto`}>
              Небольшая команда энтузиастов, которые делают обучение гитаре доступным для всех
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 text-center border hover:border-primary/30 transition-all w-64`}>
                <div className="text-5xl mb-3">{member.icon}</div>
                <h3 className={`text-lg font-bold ${styles.textPrimary}`}>{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Путь развития */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`${isDark ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30' : 'bg-white'} rounded-2xl border ${styles.cardBg} p-8`}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className={`text-xl font-bold ${styles.textPrimary}`}>Планы развития</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg`}>
                <div className={`w-8 h-8 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-lg flex items-center justify-center`}>🎸</div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Ещё больше песен и аккордов</span>
              </div>
              <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg`}>
                <div className={`w-8 h-8 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-lg flex items-center justify-center`}>📱</div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Мобильное приложение</span>
              </div>
              <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg`}>
                <div className={`w-8 h-8 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-lg flex items-center justify-center`}>🎓</div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Видео-уроки и теоретические материалы</span>
              </div>
              <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg`}>
                <div className={`w-8 h-8 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-lg flex items-center justify-center`}>🌍</div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Английская версия сайта</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className={`${isDark ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 'bg-primary/5'} rounded-2xl border border-primary/20 p-8`}>
            <h2 className={`text-2xl md:text-3xl font-bold ${styles.textPrimary} mb-3`}>
              Готовы начать?
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Присоединяйтесь к сообществу GuitarSync и начните своё музыкальное путешествие уже сегодня
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/tuner" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all">
                Начать обучение <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/game" className={`inline-flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} rounded-xl font-semibold transition-all`}>
                Попробовать игру <Gamepad2 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section className="py-8 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-8`}>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-full flex items-center justify-center mb-2`}>
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Email для связи</p>
                <a href="mailto:guitarsync@yandex.ru" className={`${styles.textPrimary} hover:text-primary transition-colors`}>
                  guitarsync@yandex.ru
                </a>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-full flex items-center justify-center mb-2`}>
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>GitHub</p>
                <a href="https://github.com/Igoreha1/guitar-learning-app" target="_blank" rel="noopener noreferrer" className={`${styles.textPrimary} hover:text-primary transition-colors`}>
                  github.com/Igoreha1
                </a>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} rounded-full flex items-center justify-center mb-2`}>
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Присоединяйтесь</p>
                <span className={styles.textPrimary}>ВКонтакте • Telegram</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}