import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

// Настройки для Яндекс.Почты
const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ========== РЕГИСТРАЦИЯ ==========
export async function sendVerificationEmail(email: string, code: string, name: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"GuitarSync" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Подтверждение регистрации в GuitarSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%); padding: 30px; border-radius: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 48px;">🎸</div>
              <h1 style="color: #e74c3c;">GuitarSync</h1>
              <p style="color: #aaa;">Ваш код подтверждения регистрации</p>
            </div>
            <div style="background: #2d2d3d; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h2 style="color: #fff; letter-spacing: 10px; font-size: 32px;">${code}</h2>
            </div>
            <p style="color: #aaa;">Код действителен 15 минут.</p>
          </div>
        </div>
      `,
    });
    console.log(`✅ Verification email отправлен на ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки verification email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"GuitarSync" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Добро пожаловать в GuitarSync! 🎸',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%); padding: 30px; border-radius: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 48px;">🎸🎉</div>
              <h1 style="color: #e74c3c;">Добро пожаловать, ${name}!</h1>
            </div>
            <div style="margin-top: 20px;">
              <h3>Что вас ждёт:</h3>
              <ul>
                <li>🎵 Точный тюнер</li>
                <li>🥁 Метроном</li>
                <li>🎼 Генератор аккордов</li>
                <li>📖 Библиотека песен</li>
                <li>🎮 Тренировки с оценкой точности</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/lessons" style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px;">
                Начать обучение →
              </a>
            </div>
          </div>
        </div>
      `,
    });
    console.log(`✅ Welcome email отправлен на ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки welcome email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, code: string, name: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"GuitarSync" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Восстановление пароля в GuitarSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%); padding: 30px; border-radius: 15px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px;">🎸🔐</div>
              <h1 style="color: #e74c3c;">GuitarSync</h1>
              <p style="color: #aaa;">Восстановление пароля</p>
            </div>
            <p style="color: #ddd;">Здравствуйте, ${name}!</p>
            <p style="color: #aaa;">
              Вы запросили сброс пароля для вашего аккаунта. Введите код ниже, чтобы установить новый пароль.
            </p>
            <div style="background: #2d2d3d; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h2 style="color: #fff; letter-spacing: 10px; font-size: 32px;">${code}</h2>
            </div>
            <p style="color: #aaa; text-align: center; margin-top: 20px;">
              Код действителен в течение <strong style="color: #e74c3c;">15 минут</strong>
            </p>
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #888; font-size: 12px;">
                Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `Восстановление пароля в GuitarSync\n\nВаш код: ${code}\n\nКод действителен 15 минут.\n\nЕсли вы не запрашивали сброс пароля, просто проигнорируйте это письмо.`,
    });
    console.log(`✅ Password reset email отправлен на ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки password reset email:', error);
    return false;
  }
}

// ========== ПОДПИСКА НА НОВОСТИ ==========
export async function sendSubscriptionConfirmation(email: string, name: string, isResubscribe: boolean = false): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"GuitarSync" <${process.env.SMTP_USER}>`,
      to: email,
      subject: isResubscribe ? 'С возвращением в GuitarSync! 🎸' : 'Подтверждение подписки на новости GuitarSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%); padding: 30px; border-radius: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 48px;">🎸📧</div>
              <h1 style="color: #e74c3c;">GuitarSync</h1>
              <p style="color: #aaa;">${isResubscribe ? 'С возвращением!' : 'Подписка оформлена'}</p>
            </div>
            <p style="color: #ddd;">Здравствуйте, ${name}!</p>
            <p style="color: #aaa;">
              ${isResubscribe 
                ? 'Вы снова подписались на новости GuitarSync. Мы рады, что вы вернулись!' 
                : 'Вы успешно подписались на нашу рассылку. Теперь вы будете получать уведомления о новых песнях, аккордах и статьях.'
              }
            </p>
            <div style="background: rgba(231,76,60,0.1); border-left: 3px solid #e74c3c; padding: 16px; margin: 20px 0;">
              <p style="color: #e74c3c;">💡 Что вы будете получать:</p>
              <ul style="color: #aaa;">
                <li>🎵 Новые песни в тренажёре</li>
                <li>🎼 Свежие аккорды</li>
                <li>📖 Обучающие статьи</li>
                <li>🏆 Анонсы обновлений</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #888; font-size: 12px;">
                Отписаться от рассылки
              </a>
            </div>
          </div>
        </div>
      `,
    });
    console.log(`✅ Subscription email отправлен на ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки subscription email:', error);
    return false;
  }
}

// ========== УВЕДОМЛЕНИЯ ДЛЯ ПОДПИСЧИКОВ ==========
export async function sendNewSongNotification(song: { title: string; artist: string; difficulty: string }): Promise<void> {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: { isActive: true }
    });

    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: `"GuitarSync" <${process.env.SMTP_USER}>`,
        to: subscriber.email,
        subject: `🎸 Новая песня: ${song.title} - ${song.artist}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%); padding: 30px; border-radius: 15px;">
              <div style="text-align: center;">
                <div style="font-size: 48px;">🎸✨</div>
                <h1 style="color: #e74c3c;">Новая песня в GuitarSync!</h1>
              </div>
              <div style="background: rgba(0,0,0,0.3); padding: 20px; text-align: center; margin: 20px 0;">
                <h2 style="color: #fff;">${song.title}</h2>
                <p style="color: #aaa;">${song.artist}</p>
                <p style="color: #888;">Сложность: ${song.difficulty === 'easy' ? 'Начинающий' : song.difficulty === 'medium' ? 'Средний' : 'Продвинутый'}</p>
              </div>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/game" style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px;">
                  Играть сейчас →
                </a>
              </div>
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 12px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${subscriber.email}" style="color: #888;">Отписаться</a>
              </p>
            </div>
          </div>
        `,
      });
    }
    console.log(`✅ Song notification отправлен ${subscribers.length} подписчикам`);
  } catch (error) {
    console.error('❌ Ошибка отправки song notification:', error);
  }
}

export async function sendNewArticleNotification(article: { title: string; category: string; excerpt: string }): Promise<void> {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: { isActive: true }
    });

    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: `"GuitarSync" <${process.env.SMTP_USER}>`,
        to: subscriber.email,
        subject: `📖 Новая статья: ${article.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%); padding: 30px; border-radius: 15px;">
              <div style="text-align: center;">
                <div style="font-size: 48px;">📖🎸</div>
                <h1 style="color: #e74c3c;">Новая статья на GuitarSync</h1>
              </div>
              <div style="background: rgba(0,0,0,0.3); padding: 20px; margin: 20px 0;">
                <h2 style="color: #fff;">${article.title}</h2>
                <p style="color: #aaa;">Категория: ${article.category}</p>
                <p style="color: #888;">${article.excerpt}</p>
              </div>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/articles/${article.title.toLowerCase().replace(/ /g, '-')}" style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px;">
                  Читать статью →
                </a>
              </div>
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 12px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${subscriber.email}" style="color: #888;">Отписаться</a>
              </p>
            </div>
          </div>
        `,
      });
    }
    console.log(`✅ Article notification отправлен ${subscribers.length} подписчикам`);
  } catch (error) {
    console.error('❌ Ошибка отправки article notification:', error);
  }
}