import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin, user } = useAuth();

  // Если пользователь уже авторизован — перенаправляем
  if (user) {
    window.location.href = '/';
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await authLogin(login, password);
    if (success) {
      window.location.href = '/';
    } else {
      setError('Неверный логин или пароль');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>СТО Диспетчер</h2>
        <h3>Вход в систему</h3>
        
        {error && <div style={{ color: '#e74c3c', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="demo-info">
          <p>Тестовые данные:</p>
          <p>Админ: admin / 123456</p>
          <p>Работник: ivanov / 123456</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;