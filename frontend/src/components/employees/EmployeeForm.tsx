import React, { useState } from 'react';
import { createEmployee, updateEmployee } from '../../api/client';
import { Employee } from '../../types';

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
  onSuccess: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    passport_series: employee?.passport_series || '',
    passport_number: employee?.passport_number || '',
    full_name: employee?.full_name || '',
    birth_year: employee?.birth_year || '',
    position: employee?.position || '',
    rank: employee?.rank || 1,
    login: employee?.login || '',
    role: employee?.role || 'worker',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.position || !formData.login) {
      alert('Заполните обязательные поля');
      return;
    }
    setLoading(true);
    try {
      if (employee) {
        await updateEmployee(employee.id, formData);
      } else {
        if (!formData.password) {
          alert('Введите пароль');
          setLoading(false);
          return;
        }
        const { password, ...data } = formData;
        await createEmployee(data, password);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{employee ? 'Редактировать' : 'Новый работник'}</h3>
        <input type="text" placeholder="ФИО *" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
        <input type="text" placeholder="Должность *" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
        <input type="text" placeholder="Логин *" value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} />
        {!employee && <input type="password" placeholder="Пароль *" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />}
        <input type="text" placeholder="Серия паспорта" value={formData.passport_series} onChange={(e) => setFormData({ ...formData, passport_series: e.target.value })} />
        <input type="text" placeholder="Номер паспорта" value={formData.passport_number} onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })} />
        <input type="number" placeholder="Год рождения" value={formData.birth_year} onChange={(e) => setFormData({ ...formData, birth_year: parseInt(e.target.value) })} />
        <input type="number" placeholder="Разряд" value={formData.rank} onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) })} />
        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'worker' })}>
          <option value="worker">Работник</option>
          <option value="admin">Администратор</option>
        </select>
        <div className="modal-buttons">
          <button onClick={onClose}>Отмена</button>
          <button className="add-btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;