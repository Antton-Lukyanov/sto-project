import React, { useEffect, useState } from 'react';
import { getServices } from '../../api/client';
import { Service } from '../../types';

interface PriceListProps {
  onSelect?: (service: Service) => void;
}

const PriceList: React.FC<PriceListProps> = ({ onSelect }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await getServices();
      setServices(response.data);
      setLoading(false);
    };
    load();
  }, []);

  const categories = ['all', ...new Set(services.map(s => s.category))];
  const filtered = category === 'all' ? services : services.filter(s => s.category === category);

  if (loading) return <div>Загрузка прайс-листа...</div>;

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '5px' }}>
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Все категории' : c}</option>)}
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Код</th>
              <th>Услуга</th>
              <th>Нормо-часы</th>
              <th>Ставка</th>
              <th>Итого</th>
              {onSelect && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(service => (
              <tr key={service.id}>
                <td>{service.code}</td>
                <td><strong>{service.name}</strong><br/><small>{service.description}</small></td>
                <td>{service.labor_hours}</td>
                <td>{service.labor_rate.toLocaleString()} ₽</td>
                <td><strong>{service.total_price.toLocaleString()} ₽</strong></td>
                {onSelect && <td><button className="add-btn" onClick={() => onSelect(service)}>Выбрать</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceList;