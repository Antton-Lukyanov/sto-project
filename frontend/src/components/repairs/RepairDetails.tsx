import React, { useEffect, useState } from 'react';
import { getRepairOrderById, getOrderServices, getOrderDefects, updateRepairOrder, generateInvoice, getInvoiceByOrderId } from '../../api/client';
import { RepairOrder, Service, Defect, Invoice } from '../../types';

interface RepairDetailsProps {
  orderId: number;
  onClose: () => void;
  onRefresh: () => void;
  isAdmin?: boolean;
}

const RepairDetails: React.FC<RepairDetailsProps> = ({ orderId, onClose, onRefresh, isAdmin = false }) => {
  const [order, setOrder] = useState<RepairOrder | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [defects, setDefects] = useState<any[]>([]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      const orderRes = await getRepairOrderById(orderId);
      const servicesRes = await getOrderServices(orderId);
      const defectsRes = await getOrderDefects(orderId);
      const invoiceRes = await getInvoiceByOrderId(orderId);
      
      setOrder(orderRes.data);
      setServices(servicesRes.data);
      setDefects(defectsRes.data);
      setInvoice(invoiceRes.data);
      setLoading(false);
    };
    load();
  }, [orderId]);

  const handleComplete = async () => {
    if (!confirm('Завершить ремонт?')) return;
    setUpdating(true);
    try {
      await updateRepairOrder(orderId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
      });
      await generateInvoice(orderId);
      onRefresh();
      onClose();
    } catch (error) {
      alert('Ошибка');
    } finally {
      setUpdating(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm('Отправить в архив?')) return;
    setUpdating(true);
    try {
      await updateRepairOrder(orderId, {
        status: 'archived',
        is_archived: true,
      });
      onRefresh();
      onClose();
    } catch (error) {
      alert('Ошибка');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="modal"><div className="modal-content">Загрузка...</div></div>;
  if (!order) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
        <h3>Заказ-наряд №{order.order_number}</h3>
        
        <table style={{ width: '100%', marginBottom: '15px' }}>
          <tbody>
            <tr><th style={{ width: '40%' }}>Дата:</th><td>{order.date}</td></tr>
            <tr><th>Автомобиль:</th><td>{order.car?.brand} {order.car?.model} ({order.car?.plate_number})</td></tr>
            <tr><th>Клиент:</th><td>{order.car?.client_full_name}</td></tr>
            <tr><th>Работник:</th><td>{order.employee?.full_name} ({order.employee?.position})</td></tr>
            <tr><th>Статус:</th><td>{order.status === 'in_progress' ? 'В работе' : order.status === 'completed' ? 'Завершён' : 'Архив'}</td></tr>
            {order.client_notes && <tr><th>Примечания:</th><td>{order.client_notes}</td></tr>}
          </tbody>
        </table>
        
        <h4>Услуги</h4>
        <table style={{ width: '100%', marginBottom: '15px' }}>
          <thead>
            <tr><th>Услуга</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.quantity}</td>
                <td>{s.unit_price?.toLocaleString()} ₽</td>
                <td>{s.total?.toLocaleString()} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h4>Дефекты</h4>
        <table style={{ width: '100%', marginBottom: '15px' }}>
          <thead>
            <tr><th>Код</th><th>Описание</th><th>Примечания</th></tr>
          </thead>
          <tbody>
            {defects.map((d, i) => (
              <tr key={i}>
                <td>{d.code}</td>
                <td>{d.description}</td>
                <td>{d.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ textAlign: 'right', fontSize: '18px', marginBottom: '20px' }}>
          <strong>Итого: {order.total_amount?.toLocaleString()} ₽</strong>
        </div>
        
        {invoice && (
          <div style={{ marginBottom: '20px', padding: '10px', background: '#e8f8f5', borderRadius: '5px' }}>
            <strong>Счёт №{invoice.invoice_number}</strong><br/>
            Дата выдачи: {invoice.issued_date}<br/>
            Статус оплаты: {invoice.payment_status === 'paid' ? 'Оплачен' : invoice.payment_status === 'pending' ? 'Ожидает оплаты' : 'Просрочен'}
          </div>
        )}
        
        <div className="modal-buttons">
          {order.status === 'in_progress' && isAdmin && (
            <>
              <button className="add-btn" onClick={handleComplete} disabled={updating}>Завершить ремонт</button>
            </>
          )}
          {order.status === 'completed' && isAdmin && (
            <button onClick={handleArchive} disabled={updating}>Отправить в архив</button>
          )}
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default RepairDetails;