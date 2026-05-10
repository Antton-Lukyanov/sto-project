import React, { useState } from 'react';
import { addCarToClient, updateCar } from '../../api/client';
import { Car } from '../../types';

interface CarFormProps {
  clientId: number;
  car?: Car;
  onClose: () => void;
  onSuccess: () => void;
}

const CarForm: React.FC<CarFormProps> = ({ clientId, car, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    plate_number: car?.plate_number || '',
    vin_code: car?.vin_code || '',
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    color: car?.color || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.plate_number || !formData.vin_code || !formData.brand || !formData.model) {
      alert('Заполните обязательные поля');
      return;
    }
    setLoading(true);
    try {
      if (car) {
        await updateCar(car.id, formData);
      } else {
        await addCarToClient(clientId, formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{car ? 'Редактировать' : 'Новый автомобиль'}</h3>
        <input type="text" placeholder="Госномер *" value={formData.plate_number} onChange={(e) => setFormData({ ...formData, plate_number: e.target.value.toUpperCase() })} />
        <input type="text" placeholder="VIN-код *" value={formData.vin_code} onChange={(e) => setFormData({ ...formData, vin_code: e.target.value.toUpperCase() })} />
        <input type="text" placeholder="Марка *" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
        <input type="text" placeholder="Модель *" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
        <input type="number" placeholder="Год выпуска" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} />
        <input type="text" placeholder="Цвет" value={formData.color || ''} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
        <div className="modal-buttons">
          <button onClick={onClose}>Отмена</button>
          <button className="add-btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
        </div>
      </div>
    </div>
  );
};

export default CarForm;