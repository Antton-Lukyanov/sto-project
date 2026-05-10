import React, { useEffect, useState } from 'react';
import { getClientCars, deleteCar } from '../../api/client';
import { Car } from '../../types';

interface ClientCarsProps {
  clientId: number;
  clientName: string;
  onClose: () => void;
  onRefresh: () => void;
}

const ClientCars: React.FC<ClientCarsProps> = ({ clientId, clientName, onClose, onRefresh }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await getClientCars(clientId);
      setCars(response.data);
      setLoading(false);
    };
    load();
  }, [clientId]);

  const handleDelete = async (id: number) => {
    if (confirm('Удалить автомобиль?')) {
      await deleteCar(id);
      onRefresh();
      const response = await getClientCars(clientId);
      setCars(response.data);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: '500px' }}>
        <h3>Автомобили клиента: {clientName}</h3>
        {loading ? (
          <div>Загрузка...</div>
        ) : cars.length === 0 ? (
          <p>Нет автомобилей</p>
        ) : (
          <table style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr><th>Госномер</th><th>Марка</th><th>Модель</th><th>VIN</th><th></th></tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id}>
                  <td><strong>{car.plate_number}</strong></td>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td><small>{car.vin_code}</small></td>
                  <td><button className="delete-btn" onClick={() => handleDelete(car.id)}>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="modal-buttons">
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default ClientCars;