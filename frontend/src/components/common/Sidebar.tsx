import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/dashboard">Панель управления</NavLink>
        <NavLink to="/clients">Клиенты</NavLink>
        <NavLink to="/cars">Автомобили</NavLink>
        <NavLink to="/employees">Работники</NavLink>
        <NavLink to="/repairs">Ремонты</NavLink>
        <NavLink to="/reports">Отчёты</NavLink>
        <NavLink to="/profile">Мой профиль</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;