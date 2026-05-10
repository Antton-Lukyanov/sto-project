import React, { useEffect, useState } from 'react';
import { getCars, deleteCar } from '../api/client';
import { Car } from '../types';

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    const response = await getCars();
    setCars(response.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Удалить автомобиль?')) {
      await deleteCar(id);
      await loadCars();
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Автомобили</h1>
        <button className="refresh-btn" onClick={loadCars}>Обновить</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Госномер</th>
              <th>VIN</th>
              <th>Марка</th>
              <th>Модель</th>
              <th>Год</th>
              <th>Цвет</th>
              <th>Владелец</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td><strong>{car.plate_number}</strong></td>
                <td>{car.vin_code}</td>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{car.color || '-'}</td>
                <td>{car.client_full_name || '-'}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(car.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarsPage;