import React, { useState } from 'react';
import { createClient, updateClient } from '../../api/client';
import { Client } from '../../types';

interface ClientFormProps {
  client?: Client;
  onClose: () => void;
  onSuccess: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    passport_series: client?.passport_series || '',
    passport_number: client?.passport_number || '',
    full_name: client?.full_name || '',
    birth_year: client?.birth_year || new Date().getFullYear() - 30,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.passport_series || !formData.passport_number || !formData.full_name) {
      alert('Заполните обязательные поля');
      return;
    }
    setLoading(true);
    try {
      if (client) {
        await updateClient(client.id, formData);
      } else {
        await createClient(formData);
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
        <h3>{client ? 'Редактировать' : 'Новый клиент'}</h3>
        
        <input
          type="text"
          placeholder="Серия паспорта *"
          value={formData.passport_series}
          onChange={(e) => setFormData({ ...formData, passport_series: e.target.value })}
        />
        <input
          type="text"
          placeholder="Номер паспорта *"
          value={formData.passport_number}
          onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
        />
        <input
          type="text"
          placeholder="ФИО *"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Год рождения"
          value={formData.birth_year}
          onChange={(e) => setFormData({ ...formData, birth_year: parseInt(e.target.value) })}
        />
        
        <div className="modal-buttons">
          <button onClick={onClose}>Отмена</button>
          <button className="add-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;