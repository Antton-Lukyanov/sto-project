import React, { useState } from 'react';
import { 
  getEmployeesByCarPlate, 
  getTopDefectByBrand, 
  getTopEmployee, 
  getDefectsByClient, 
  getClientsByDefect 
} from '../api/client';

const ReportsPage: React.FC = () => {
  const [plate, setPlate] = useState('');
  const [employeesResult, setEmployeesResult] = useState<any[]>([]);
  
  const [brand, setBrand] = useState('');
  const [topDefect, setTopDefect] = useState<any>(null);
  
  const [topEmployee, setTopEmployee] = useState<any>(null);
  
  const [clientId, setClientId] = useState('');
  const [defectsResult, setDefectsResult] = useState<any[]>([]);
  
  const [defectCode, setDefectCode] = useState('');
  const [clientsResult, setClientsResult] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);

  const handleEmployeesByCar = async () => {
    if (!plate) return;
    setLoading(true);
    try {
      const res = await getEmployeesByCarPlate(plate);
      setEmployeesResult(res.data);
    } catch (err) {
      alert('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleTopDefect = async () => {
    if (!brand) return;
    setLoading(true);
    try {
      const res = await getTopDefectByBrand(brand);
      setTopDefect(res.data);
    } catch (err) {
      alert('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleTopEmployee = async () => {
    setLoading(true);
    try {
      const res = await getTopEmployee();
      setTopEmployee(res.data);
    } catch (err) {
      alert('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleDefectsByClient = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const res = await getDefectsByClient(parseInt(clientId));
      setDefectsResult(res.data);
    } catch (err) {
      alert('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleClientsByDefect = async () => {
    if (!defectCode) return;
    setLoading(true);
    try {
      const res = await getClientsByDefect(defectCode);
      setClientsResult(res.data);
    } catch (err) {
      alert('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Аналитические отчёты</h1>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>1. Кто обслуживал автомобиль</h3>
          <input type="text" placeholder="Госномер" value={plate} onChange={e => setPlate(e.target.value)} />
          <button onClick={handleEmployeesByCar} disabled={loading}>Найти</button>
          {employeesResult.length > 0 && (
            <div className="report-result">
              {employeesResult.map((e, i) => <div key={i}>• {e.full_name} ({e.position})</div>)}
            </div>
          )}
        </div>

        <div className="report-card">
          <h3>2. Самая частая неисправность марки</h3>
          <input type="text" placeholder="Марка авто" value={brand} onChange={e => setBrand(e.target.value)} />
          <button onClick={handleTopDefect} disabled={loading}>Анализировать</button>
          {topDefect && (
            <div className="report-result">
              <strong>{topDefect.code}</strong> — {topDefect.description}<br/>
              Встречается: {topDefect.occurrence_count} раз
            </div>
          )}
        </div>

        <div className="report-card">
          <h3>3. Лучший работник по выработке</h3>
          <button onClick={handleTopEmployee} disabled={loading}>Рассчитать</button>
          {topEmployee && (
            <div className="report-result">
              <strong>{topEmployee.full_name}</strong><br/>
              {topEmployee.position}<br/>
              Выработка: {topEmployee.total_earnings?.toLocaleString()} ₽
            </div>
          )}
        </div>

        <div className="report-card">
          <h3>4. Устранённые неисправности клиента</h3>
          <input type="number" placeholder="ID клиента" value={clientId} onChange={e => setClientId(e.target.value)} />
          <button onClick={handleDefectsByClient} disabled={loading}>Показать</button>
          {defectsResult.length > 0 && (
            <div className="report-result">
              {defectsResult.map((d, i) => <div key={i}>• {d.description} — {d.total_amount} ₽</div>)}
            </div>
          )}
        </div>

        <div className="report-card">
          <h3>5. Владельцы по типу неисправности</h3>
          <input type="text" placeholder="Код дефекта (DEF_001)" value={defectCode} onChange={e => setDefectCode(e.target.value)} />
          <button onClick={handleClientsByDefect} disabled={loading}>Найти</button>
          {clientsResult.length > 0 && (
            <div className="report-result">
              {clientsResult.map((c, i) => <div key={i}>• {c.full_name}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;