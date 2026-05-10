import React from 'react';
import { Car } from '../../types';

interface CarCardProps {
  car: Car;
  onDelete?: () => void;
  onEdit?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onDelete, onEdit }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{car.brand} {car.model}</strong>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>Госномер: {car.plate_number}</div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>VIN: {car.vin_code}</div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>Год: {car.year} | Цвет: {car.color || '—'}</div>
        </div>
        <div>
          {onEdit && <button onClick={onEdit} style={{ marginRight: '5px' }}>✏️</button>}
          {onDelete && <button className="delete-btn" onClick={onDelete}>🗑</button>}
        </div>
      </div>
    </div>
  );
};

export default CarCard;