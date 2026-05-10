import React, { useEffect, useState } from 'react';
import { getRepairOrders, getOrderDefects } from '../api/client';
import { RepairOrder } from '../types';

const RepairsPage: React.FC = () => {
  const [repairs, setRepairs] = useState<RepairOrder[]>([]);
  const [defectsMap, setDefectsMap] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const loadRepairs = async () => {
    const response = await getRepairOrders(showArchived);
    const repairsData = response.data;
    setRepairs(repairsData);
    
    const defectsData: Record<number, any[]> = {};
    for (const repair of repairsData) {
      try {
        const defectsRes = await getOrderDefects(repair.id);
        defectsData[repair.id] = defectsRes.data;
      } catch (e) {
        defectsData[repair.id] = [];
      }
    }
    setDefectsMap(defectsData);
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
              <th>Работник</th>
              <th>Устранённые неисправности</th>
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
                <td>{new Date(repair.date).toLocaleDateString('ru-RU')}</td>
                <td>
                  {repair.car?.brand} {repair.car?.model}
                  <br/>
                  <small>{repair.car?.plate_number}</small>
                </td>
                <td>
                  <strong>{repair.employee?.full_name || 'Не назначен'}</strong>
                  <br/>
                  <small>{repair.employee?.position}</small>
                </td>
                <td style={{ maxWidth: '250px' }}>
                  {defectsMap[repair.id]?.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '15px' }}>
                      {defectsMap[repair.id].map((d: any) => (
                        <li key={d.defect_id}>
                          <strong>{d.code}</strong> — {d.description}
                          {d.notes && (
                            <>
                              <br/>
                              <small style={{ color: '#666' }}>Примечание: {d.notes}</small>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : '—'}
                </td>
                <td>{repair.total_labor_cost?.toLocaleString()} ₽</td>
                <td>{repair.total_parts_cost?.toLocaleString()} ₽</td>
                <td><strong>{repair.total_amount?.toLocaleString()} ₽</strong></td>
                <td>
                  {repair.status === 'archived' ? 'Архив' : 
                   repair.status === 'completed' ? 'Завершён' : 'В работе'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepairsPage;