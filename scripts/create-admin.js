const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Удаляем старого админа если есть
    await prisma.user.deleteMany({
      where: { email: 'admin@guitarsync.ru' }
    });
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Хеш пароля:', hashedPassword);
    
    const admin = await prisma.user.create({
      data: {
        id: 'admin_1',
        email: 'admin@guitarsync.ru',
        name: 'Администратор',
        password: hashedPassword,
        role: 'admin'
      }
    });
    
    console.log('✅ Администратор успешно создан!');
    console.log('📧 Email: admin@guitarsync.ru');
    console.log('🔑 Пароль: admin123');
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();