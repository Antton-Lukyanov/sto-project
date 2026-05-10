import React, { useState } from 'react';
import { createService, updateService } from '../../api/client';
import { Service } from '../../types';

interface ServiceFormProps {
  service?: Service;
  onClose: () => void;
  onSuccess: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: service?.code || '',
    name: service?.name || '',
    description: service?.description || '',
    labor_hours: service?.labor_hours || 1,
    labor_rate: service?.labor_rate || 1500,
    category: service?.category || '',
    is_active: service?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.code || !formData.name || !formData.category) {
      alert('Заполните обязательные поля');
      return;
    }
    setLoading(true);
    try {
      if (service) {
        await updateService(service.id, formData);
      } else {
        await createService(formData);
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
        <h3>{service ? 'Редактировать' : 'Новая услуга'}</h3>
        <input type="text" placeholder="Код *" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
        <input type="text" placeholder="Название *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <textarea placeholder="Описание" rows={3} value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <input type="text" placeholder="Категория *" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        <input type="number" step="0.5" placeholder="Нормо-часы" value={formData.labor_hours} onChange={(e) => setFormData({ ...formData, labor_hours: parseFloat(e.target.value) })} />
        <input type="number" placeholder="Ставка (₽/час)" value={formData.labor_rate} onChange={(e) => setFormData({ ...formData, labor_rate: parseFloat(e.target.value) })} />
        <label><input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} /> Активна</label>
        <div className="modal-buttons">
          <button onClick={onClose}>Отмена</button>
          <button className="add-btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm