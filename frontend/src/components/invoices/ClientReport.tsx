import React, { useEffect, useState } from 'react';
import { getClientReport } from '../../api/client';

interface ClientReportProps {
  orderId: number;
  onClose: () => void;
}

const ClientReport: React.FC<ClientReportProps> = ({ orderId, onClose }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await getClientReport(orderId);
      setReport(res.data);
      setLoading(false);
    };
    load();
  }, [orderId]);

  if (loading) return <div className="modal"><div className="modal-content">Загрузка отчёта...</div></div>;
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: '500px' }}>
        <div id="report-content">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Акт выполненных работ</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Клиент:</strong> {report.client_name}</p>
            <p><strong>Паспорт:</strong> {report.passport_series} {report.passport_number}</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Автомобиль:</strong> {report.brand} {report.model}</p>
            <p><strong>Госномер:</strong> {report.plate_number}</p>
            <p><strong>VIN:</strong> {report.vin_code}</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Заказ-наряд №:</strong> {report.order_number}</p>
            <p><strong>Дата:</strong> {report.date}</p>
          </div>
          
          <h3>Выполненные работы</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#ecf0f1' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Услуга</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Кол-во</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Цена</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {report.services?.map((s: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.name}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.quantity}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.price?.toLocaleString()} ₽</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.total?.toLocaleString()} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <h3>Устранённые неисправности</h3>
          <ul style={{ marginBottom: '20px' }}>
            {report.defects?.map((d: any, i: number) => (
              <li key={i}>{d.code} — {d.description}</li>
            ))}
          </ul>
          
          <div style={{ textAlign: 'right', fontSize: '18px', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
            <strong>Итого к оплате: {report.total_amount?.toLocaleString()} ₽</strong>
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <div>__________/_________________/</div>
            <div>__________/_________________/</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '12px' }}>(подпись клиента)</div>
            <div style={{ fontSize: '12px' }}>(подпись мастера)</div>
          </div>
        </div>
        
        <div className="modal-buttons" style={{ marginTop: '20px' }}>
          <button onClick={handlePrint}>Печать</button>
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default ClientReport;