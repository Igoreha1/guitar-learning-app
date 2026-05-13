"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Save, User, Mail, Phone, MapPin, 
  Calendar, Music, 
  Guitar, Sparkles, Camera, ChevronRight, LogOut
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    github?: string;
  };
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: '',
    bio: '',
    location: '',
    phone: '',
    instagram: '',
    twitter: '',
    github: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.user) {
        setUser(data.user);
        setForm({
          name: data.user.name || '',
          bio: data.user.bio || '',
          location: data.user.location || '',
          phone: data.user.phone || '',
          instagram: data.user.social?.instagram || '',
          twitter: data.user.social?.twitter || '',
          github: data.user.social?.github || ''
        });
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success && data.avatar) {
        setUser(prev => prev ? { ...prev, avatar: data.avatar } : prev);
      }
    } catch (error) {
      alert('Ошибка загрузки аватара');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          bio: form.bio,
          location: form.location,
          phone: form.phone,
          social: {
            instagram: form.instagram,
            twitter: form.twitter,
            github: form.github
          }
        })
      });

      if (res.ok) {
        router.push('/profile');
      } else {
        alert('Ошибка при сохранении');
      }
    } catch (error) {
      alert('Ошибка');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker pb-12">
      {/* Hero секция */}
      <section className="relative overflow-hidden pt-16 pb-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Link href="/profile" className="hover:text-primary transition-colors flex items-center gap-1">
                  Профиль
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-300">Редактирование</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Редактировать профиль
                </span>
              </h1>
            </div>
          </div>

          {/* Карточка редактирования */}
          <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl border border-gray-800 overflow-hidden">
            {/* Аватар */}
            <div className="relative h-32 bg-gradient-to-r from-primary/20 to-purple-500/20">
              <div className="absolute -bottom-12 left-8 flex items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-4xl shadow-lg shadow-primary/20 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🎸</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-1.5 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-gray-300" />
                    )}
                  </label>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="p-8 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Основная информация */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-700">
                    <User className="w-5 h-5 text-primary" />
                    Основная информация
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">О себе</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Расскажите о себе, своём опыте игры на гитаре..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Город</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        placeholder="Москва"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                  </div>
                </div>

                {/* Социальные сети */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-700">
                    <Guitar className="w-5 h-5 text-primary" />
                    Социальные сети
                  </h3>

                  <div className="pt-4">
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Информация
                      </div>
                      <p className="text-xs text-gray-500">
                        Ваши социальные сети будут отображаться в публичном профиле
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Сохранить изменения
                    </>
                  )}
                </button>
                <Link
                  href="/profile"
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition text-center"
                >
                  Отмена
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}