import React, { useEffect, useState } from 'react';
import { getMe } from '../api/client';

interface UserProfile {
  id: number;
  full_name: string;
  login: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMe();
        setProfile(response.data);
      } catch (error) {
        console.error('Ошибка загрузки профиля', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) return <div className="loading">Загрузка профиля...</div>;
  if (!profile) return <div className="error">Не удалось загрузить профиль</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Мой профиль</h1>
      </div>
      <div className="profile-card">
        <div className="profile-field">
          <div className="label">ФИО:</div>
          <div>{profile.full_name}</div>
        </div>
        <div className="profile-field">
          <div className="label">Логин:</div>
          <div>{profile.login}</div>
        </div>
        <div className="profile-field">
          <div className="label">Роль:</div>
          <div>{profile.role === 'admin' ? 'Администратор' : 'Работник'}</div>
        </div>
        <div className="profile-field">
          <div className="label">ID:</div>
          <div>{profile.id}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;