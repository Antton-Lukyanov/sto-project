import React, { useEffect, useState } from 'react';
import { getClients, getCars, getEmployees, getRepairOrders, getTopEmployee } from '../api/client';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    clients: 0,
    cars: 0,
    employees: 0,
    activeRepairs: 0,
    archivedRepairs: 0,
  });
  const [topEmployee, setTopEmployee] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [clientsRes, carsRes, employeesRes, repairsRes, archivedRes, topRes] = await Promise.all([
          getClients(), getCars(), getEmployees(), getRepairOrders(false), getRepairOrders(true), getTopEmployee()
        ]);
        setStats({
          clients: clientsRes.data.length,
          cars: carsRes.data.length,
          employees: employeesRes.data.length,
          activeRepairs: repairsRes.data.length,
          archivedRepairs: archivedRes.data.length,
        });
        setTopEmployee(topRes.data);
      } catch (err) {
        console.error('Ошибка загрузки статистики', err);
      }
    };
    loadStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Панель управления</h1>
      </div>
      <div className="reports-grid">
        <div className="report-card"><h3>Клиентов</h3><p style={{fontSize:'32px',color:'#2ecc71'}}>{stats.clients}</p></div>
        <div className="report-card"><h3>Автомобилей</h3><p style={{fontSize:'32px',color:'#3498db'}}>{stats.cars}</p></div>
        <div className="report-card"><h3>Работников</h3><p style={{fontSize:'32px',color:'#e67e22'}}>{stats.employees}</p></div>
        <div className="report-card"><h3>Ремонтов в работе</h3><p style={{fontSize:'32px',color:'#e74c3c'}}>{stats.activeRepairs}</p></div>
        <div className="report-card"><h3>Архив ремонтов</h3><p style={{fontSize:'32px',color:'#95a5a6'}}>{stats.archivedRepairs}</p></div>
      </div>
      {topEmployee && (
        <div className="report-card" style={{marginTop:'20px'}}>
          <h3>Лучший работник</h3>
          <p><strong>{topEmployee.full_name}</strong> — {topEmployee.position}</p>
          <p>Выработка: {topEmployee.total_earnings?.toLocaleString()} ₽</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;