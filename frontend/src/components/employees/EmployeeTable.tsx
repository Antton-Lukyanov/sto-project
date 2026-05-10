import React, { useState } from 'react';
import { Employee } from '../../types';
import EmployeeProfile from './EmployeeProfile';

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: number) => void;
  onEdit: (employee: Employee) => void;
  isAdmin: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onDelete, onEdit, isAdmin }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Должность</th>
              <th>Разряд</th>
              <th>Ремонтов</th>
              <th>Выработка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>
                  <button style={{ background: 'none', color: '#3498db', padding: 0 }} onClick={() => setSelectedEmployee(emp.id)}>
                    {emp.full_name}
                  </button>
                </td>
                <td>{emp.position}</td>
                <td>{emp.rank}</td>
                <td>{emp.repairs_count || 0}</td>
                <td>{(emp.total_earnings || 0).toLocaleString()} ₽</td>
                <td>
                  {isAdmin && <button onClick={() => onEdit(emp)}>✏️</button>}
                  {isAdmin && <button className="delete-btn" onClick={() => onDelete(emp.id)}>🗑</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedEmployee && <EmployeeProfile employeeId={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
    </>
  );
};

export default EmployeeTable;