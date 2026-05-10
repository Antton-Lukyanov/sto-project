import React from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'worker')[];
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, fallback }) => {
  // Демо-версия: всегда показываем children
  // В реальном проекте здесь проверка роли из токена
  const userRole: 'admin' | 'worker' = 'admin';
  
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  return <>{fallback || <div style={{ padding: '20px', textAlign: 'center' }}>Нет доступа</div>}</>;
};

export default RoleGuard;