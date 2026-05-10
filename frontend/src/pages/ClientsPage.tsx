import React, { useEffect, useState } from 'react';
import { getClients, deleteClient, addCarToClient } from '../api/client';
import { Client } from '../types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCar, setShowAddCar] = useState<number | null>(null);
  const [newCar, setNewCar] = useState({
    plate_number: '',
    vin_code: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
  });

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClients();
      setClients(response.data);
    } catch (err: any) {
      console.error('Ошибка загрузки:', err);
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить клиента?')) return;
    try {
      await deleteClient(id);
      await loadClients();
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const handleAddCar = async (clientId: number) => {
    if (!newCar.plate_number || !newCar.vin_code || !newCar.brand || !newCar.model) {
      alert('Заполните госномер, VIN, марку и модель');
      return;
    }
    try {
      await addCarToClient(clientId, newCar);
      setShowAddCar(null);
      setNewCar({ plate_number: '', vin_code: '', brand: '', model: '', year: 2024, color: '' });
      await loadClients();
    } catch (err) {
      alert('Ошибка добавления автомобиля');
    }
  };

  if (loading) return <div className="loading">Загрузка клиентов...</div>;
  if (error) return <div className="error">Ошибка: {error}. Проверьте подключение к серверу.</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Клиенты</h1>
        <button className="refresh-btn" onClick={loadClients}>Обновить</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Паспорт</th>
              <th>Год рождения</th>
              <th>Автомобили</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.full_name}</td>
                <td>{client.passport_series} {client.passport_number}</td>
                <td>{client.birth_year}</td>
                <td>
                  {client.cars && client.cars.length > 0 ? (
                    <ul className="cars-list">
                      {client.cars.map(c => (
                        <li key={c.id}>
                          <strong>{c.brand} {c.model}</strong> — {c.plate_number}
                          {c.color && ` (${c.color})`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'Нет автомобилей'
                  )}
                </td>
                <td>
                  <button className="add-btn" onClick={() => setShowAddCar(client.id)}>+ Авто</button>
                  <button className="delete-btn" onClick={() => handleDelete(client.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddCar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Добавить автомобиль</h3>
            <input 
              type="text" 
              placeholder="Госномер (пример: a222aa50)" 
              value={newCar.plate_number} 
              onChange={e => setNewCar({ ...newCar, plate_number: e.target.value.toLowerCase() })} 
            />
            <input 
              type="text" 
              placeholder="VIN-код" 
              value={newCar.vin_code} 
              onChange={e => setNewCar({ ...newCar, vin_code: e.target.value.toUpperCase() })} 
            />
            <input 
              type="text" 
              placeholder="Марка" 
              value={newCar.brand} 
              onChange={e => setNewCar({ ...newCar, brand: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Модель" 
              value={newCar.model} 
              onChange={e => setNewCar({ ...newCar, model: e.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Год" 
              value={newCar.year} 
              onChange={e => setNewCar({ ...newCar, year: parseInt(e.target.value) })} 
            />
            <input 
              type="text" 
              placeholder="Цвет" 
              value={newCar.color} 
              onChange={e => setNewCar({ ...newCar, color: e.target.value })} 
            />
            <div className="modal-buttons">
              <button onClick={() => setShowAddCar(null)}>Отмена</button>
              <button className="add-btn" onClick={() => handleAddCar(showAddCar)}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;