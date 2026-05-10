import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'worker';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  // Демо-версия: всегда пропускаем
  // В реальном проекте здесь проверка токена и роли
  return <>{children}</>;
};

export default AuthGuard;