import React, { useEffect, useState } from 'react';
import { getEmployeeById, getEmployeeStats } from '../../api/client';
import { Employee } from '../../types';

interface EmployeeProfileProps {
  employeeId: number;
  onClose: () => void;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employeeId, onClose }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const empRes = await getEmployeeById(employeeId);
      const statsRes = await getEmployeeStats(employeeId);
      setEmployee(empRes.data);
      setStats(statsRes.data);
      setLoading(false);
    };
    load();
  }, [employeeId]);

  if (loading) return <div className="modal"><div className="modal-content">Загрузка...</div></div>;
  if (!employee) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: '450px' }}>
        <h3>Профиль работника</h3>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr><th>ФИО</th><td>{employee.full_name}</td></tr>
            <tr><th>Паспорт</th><td>{employee.passport_series} {employee.passport_number}</td></tr>
            <tr><th>Должность</th><td>{employee.position}</td></tr>
            <tr><th>Разряд</th><td>{employee.rank}</td></tr>
            <tr><th>Роль</th><td>{employee.role === 'admin' ? 'Администратор' : 'Работник'}</td></tr>
            <tr><th>Всего ремонтов</th><td>{stats?.total_repairs || 0}</td></tr>
            <tr><th>Общая выработка</th><td><strong>{(stats?.total_earnings || 0).toLocaleString()} ₽</strong></td></tr>
            <tr><th>Средний чек</th><td>{(stats?.avg_order_value || 0).toLocaleString()} ₽</td></tr>
          </tbody>
        </table>
        <div className="modal-buttons">
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;