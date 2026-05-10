import React, { useState } from 'react';
import { RepairOrder } from '../../types';
import RepairDetails from './RepairDetails';

interface RepairOrderListProps {
  repairs: RepairOrder[];
  onRefresh: () => void;
  isAdmin?: boolean;
}

const RepairOrderList: React.FC<RepairOrderListProps> = ({ repairs, onRefresh, isAdmin = false }) => {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершён';
      case 'archived': return 'Архив';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return '#f39c12';
      case 'completed': return '#27ae60';
      case 'archived': return '#95a5a6';
      default: return '#333';
    }
  };

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>№ заказа</th>
              <th>Дата</th>
              <th>Автомобиль</th>
              <th>Клиент</th>
              <th>Работник</th>
              <th>Стоимость</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((repair) => (
              <tr key={repair.id}>
                <td>{repair.order_number}</td>
                <td>{repair.date}</td>
                <td>
                  {repair.car?.brand} {repair.car?.model}<br/>
                  <small>{repair.car?.plate_number}</small>
                </td>
                <td>{repair.car?.client_full_name || '-'}</td>
                <td>{repair.employee?.full_name || '-'}</td>
                <td><strong>{repair.total_amount?.toLocaleString()} ₽</strong></td>
                <td style={{ color: getStatusColor(repair.status) }}>{getStatusText(repair.status)}</td>
                <td>
                  <button onClick={() => setSelectedOrder(repair.id)}>Детали</button>
                </td>
              </tr>
            ))}
            {repairs.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>Нет заказов</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {selectedOrder && (
        <RepairDetails
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={onRefresh}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
};

export default RepairOrderList;