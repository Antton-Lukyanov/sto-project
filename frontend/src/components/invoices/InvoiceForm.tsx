import React, { useEffect, useState } from 'react';
import { getInvoiceByOrderId, updateInvoiceStatus } from '../../api/client';
import { Invoice } from '../../types';

interface InvoiceFormProps {
  orderId: number;
  onClose: () => void;
  onRefresh: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ orderId, onClose, onRefresh }) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await getInvoiceByOrderId(orderId);
      setInvoice(res.data);
      setLoading(false);
    };
    load();
  }, [orderId]);

  const handleStatusChange = async (status: 'pending' | 'paid' | 'overdue') => {
    if (!invoice) return;
    setUpdating(true);
    try {
      await updateInvoiceStatus(invoice.id, status);
      const res = await getInvoiceByOrderId(orderId);
      setInvoice(res.data);
      onRefresh();
    } catch (error) {
      alert('Ошибка обновления');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="modal"><div className="modal-content">Загрузка...</div></div>;
  if (!invoice) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Счёт №{invoice.invoice_number}</h3>
        
        <table style={{ width: '100%', marginBottom: '20px' }}>
          <tbody>
            <tr><th style={{ width: '40%' }}>Дата выдачи:</th><td>{invoice.issued_date}</td></tr>
            <tr><th>Статус оплаты:</th>
              <td>
                <select value={invoice.payment_status} onChange={(e) => handleStatusChange(e.target.value as any)} disabled={updating}>
                  <option value="pending">Ожидает оплаты</option>
                  <option value="paid">Оплачен</option>
                  <option value="overdue">Просрочен</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="modal-buttons">
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;