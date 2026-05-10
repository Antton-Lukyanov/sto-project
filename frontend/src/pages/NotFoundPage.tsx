import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/">
        <button>Вернуться на главную</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;