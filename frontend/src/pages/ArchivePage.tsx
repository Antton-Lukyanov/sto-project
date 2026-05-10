import React, { useEffect, useState } from 'react';
import { getRepairOrders } from '../api/client';
import { RepairOrder } from '../types';

const ArchivePage: React.FC = () => {
  const [archivedRepairs, setArchivedRepairs] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArchive = async () => {
      const response = await getRepairOrders(true);
      setArchivedRepairs(response.data);
      setLoading(false);
    };
    loadArchive();
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Архив ремонтов</h1>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>№ заказа</th>
              <th>Дата</th>
              <th>Автомобиль</th>
              <th>Владелец</th>
              <th>Работник</th>
              <th>Стоимость работ</th>
              <th>Запчасти</th>
              <th>Итого</th>
              <th>Дата завершения</th>
            </tr>
          </thead>
          <tbody>
            {archivedRepairs.map((repair) => (
              <tr key={repair.id}>
                <td>{repair.order_number}</td>
                <td>{repair.date}</td>
                <td>
                  {repair.car?.brand} {repair.car?.model}<br/>
                  <small>{repair.car?.plate_number}</small>
                </td>
                <td>{repair.car?.client_full_name || '-'}</td>
                <td>{repair.employee?.full_name || '-'}</td>
                <td>{repair.total_labor_cost?.toLocaleString()} ₽</td>
                <td>{repair.total_parts_cost?.toLocaleString()} ₽</td>
                <td><strong>{repair.total_amount?.toLocaleString()} ₽</strong></td>
                <td>{repair.completed_at ? new Date(repair.completed_at).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArchivePage;