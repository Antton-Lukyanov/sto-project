import React, { useState } from 'react';
import { getEmployeeStats } from '../../api/client';

interface EmployeeStatsProps {
  employeeId: number;
  employeeName: string;
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ employeeId, employeeName }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState({ startDate: '', endDate: '' });

  const loadStats = async () => {
    setLoading(true);
    const res = await getEmployeeStats(employeeId, period.startDate || undefined, period.endDate || undefined);
    setStats(res.data);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <input type="date" value={period.startDate} onChange={(e) => setPeriod({ ...period, startDate: e.target.value })} style={{ padding: '8px' }} />
        <input type="date" value={period.endDate} onChange={(e) => setPeriod({ ...period, endDate: e.target.value })} style={{ padding: '8px' }} />
        <button onClick={loadStats} disabled={loading}>Показать статистику</button>
      </div>
      
      {stats && (
        <div className="result-card">
          <h4>{employeeName}</h4>
          <p>Всего ремонтов: <strong>{stats.total_repairs}</strong></p>
          <p>Общая выработка: <strong>{stats.total_earnings?.toLocaleString()} ₽</strong></p>
          <p>Средний чек: <strong>{stats.avg_order_value?.toLocaleString()} ₽</strong></p>
        </div>
      )}
    </div>
  );
};

export default EmployeeStats;