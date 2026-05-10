import React, { useEffect, useState } from 'react';
import { getRepairOrders } from '../api/client';
import { RepairOrder } from '../types';

const RepairsPage: React.FC = () => {
  const [repairs, setRepairs] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const loadRepairs = async () => {
    const response = await getRepairOrders(showArchived);
    setRepairs(response.data);
    setLoading(false);
  };

  useEffect(() => {
    loadRepairs();
  }, [showArchived]);

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Ремонты</h1>
        <button onClick={() => setShowArchived(!showArchived)}>
          {showArchived ? 'Показать текущие' : 'Показать архив'}
        </button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>№ заказа</th>
              <th>Дата</th>
              <th>Автомобиль</th>
              <th>Клиент</th>
              <th>Работник</th>
              <th>Работы</th>
              <th>Запчасти</th>
              <th>Итого</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((repair) => (
              <tr key={repair.id}>
                <td>{repair.order_number}</td>
                <td>{repair.date}</td>
                <td>{repair.car?.brand} {repair.car?.model}<br/><small>{repair.car?.plate_number}</small></td>
                <td>{repair.car?.client_full_name || '-'}</td>
                <td><strong>{repair.employee?.full_name || 'Не назначен'}</strong><br/><small>{repair.employee?.position}</small></td>
                <td>{repair.total_labor_cost?.toLocaleString()} ₽</td>
                <td>{repair.total_parts_cost?.toLocaleString()} ₽</td>
                <td><strong>{repair.total_amount?.toLocaleString()} ₽</strong></td>
                <td>{repair.status === 'archived' ? 'Архив' : repair.status === 'completed' ? 'Завершён' : 'В работе'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepairsPage;