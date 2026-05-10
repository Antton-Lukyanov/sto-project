import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  user?: { full_name: string; role: string } | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header-logo">
        <h1>СТО Диспетчерская система</h1>
      </div>
      <div className="user-info">
        <Link to="/profile" className="user-name">
          {user?.full_name || 'Пользователь'}
        </Link>
        <span className="user-role">{user?.role === 'admin' ? 'Админ' : 'Работник'}</span>
        <button onClick={logout} className="logout-btn">Выйти</button>
      </div>
    </header>
  );
};

export default Header;