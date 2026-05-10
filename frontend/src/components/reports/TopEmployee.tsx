import React, { useEffect, useState } from 'react';
import { getTopEmployee } from '../../api/client';

const TopEmployee: React.FC = () => {
  const [topEmployee, setTopEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await getTopEmployee();
    setTopEmployee(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!topEmployee) return <div>Нет данных</div>;

  return (
    <div className="result-card">
      <h3>Лучший работник</h3>
      <p><strong>{topEmployee.full_name}</strong></p>
      <p>Должность: {topEmployee.position}</p>
      <p>Разряд: {topEmployee.rank}</p>
      <p>Всего ремонтов: {topEmployee.total_repairs}</p>
      <p>Выработка: <strong>{topEmployee.total_earnings?.toLocaleString()} ₽</strong></p>
    </div>
  );
};

export default TopEmployee;