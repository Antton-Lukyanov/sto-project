import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../api/client';
import { Employee } from '../types';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    const response = await getEmployees();
    setEmployees(response.data);
    setLoading(false);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Удалить работника?')) {
      await deleteEmployee(id);
      await loadEmployees();
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Работники</h1>
        <button className="refresh-btn" onClick={loadEmployees}>Обновить</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Должность</th>
              <th>Ремонтов</th>
              <th>Выработка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.full_name}</td>
                <td>{emp.position}</td>
                <td>{emp.repairs_count || 0}</td>
                <td>{(emp.total_earnings || 0).toLocaleString()} ₽</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(emp.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesPage;