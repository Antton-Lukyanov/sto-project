import React, { useState, useEffect } from 'react';
import { createRepairOrder, getCars, getEmployees, getServices, addServiceToOrder, addDefectToOrder, getDefects } from '../../api/client';
import { Car, Employee, Service, Defect } from '../../types';

interface RepairOrderFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const RepairOrderForm: React.FC<RepairOrderFormProps> = ({ onClose, onSuccess }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<{ service_id: number; quantity: number; unit_price: number }[]>([]);
  const [selectedDefects, setSelectedDefects] = useState<{ defect_id: number; notes: string }[]>([]);
  
  const [formData, setFormData] = useState({
    order_number: 'ORD-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    car_id: 0,
    employee_id: 0,
    client_notes: '',
    status: 'in_progress' as const,
    total_labor_cost: 0,
    total_parts_cost: 0,
    is_archived: false,
  });

  useEffect(() => {
    const loadData = async () => {
      const carsRes = await getCars();
      const employeesRes = await getEmployees();
      const servicesRes = await getServices();
      const defectsRes = await getDefects();
      setCars(carsRes.data);
      setEmployees(employeesRes.data);
      setServices(servicesRes.data);
      setDefects(defectsRes.data);
    };
    loadData();
  }, []);

  const addService = (service: Service) => {
    setSelectedServices([...selectedServices, {
      service_id: service.id,
      quantity: 1,
      unit_price: service.total_price,
    }]);
  };

  const addDefect = (defect: Defect) => {
    setSelectedDefects([...selectedDefects, {
      defect_id: defect.id,
      notes: '',
    }]);
  };

  const removeService = (index: number) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const removeDefect = (index: number) => {
    setSelectedDefects(selectedDefects.filter((_, i) => i !== index));
  };

  const updateServiceQuantity = (index: number, quantity: number) => {
    const updated = [...selectedServices];
    updated[index].quantity = quantity;
    setSelectedServices(updated);
  };

  const updateDefectNotes = (index: number, notes: string) => {
    const updated = [...selectedDefects];
    updated[index].notes = notes;
    setSelectedDefects(updated);
  };

  const handleSubmit = async () => {
    if (!formData.car_id || !formData.employee_id) {
      alert('Выберите автомобиль и работника');
      return;
    }
    setLoading(true);
    try {
      const totalLabor = selectedServices.reduce((sum, s) => {
        const service = services.find(srv => srv.id === s.service_id);
        return sum + (service ? service.total_price * s.quantity : 0);
      }, 0);
      
      const orderData = { ...formData, total_labor_cost: totalLabor, total_parts_cost: 0 };
      const orderRes = await createRepairOrder(orderData);
      const orderId = orderRes.data.id;

      for (const service of selectedServices) {
        await addServiceToOrder(orderId, service.service_id, service.quantity, service.unit_price);
      }
      for (const defect of selectedDefects) {
        await addDefectToOrder(orderId, defect.defect_id, defect.notes || null);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      alert('Ошибка создания заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <h3>Новый заказ-наряд</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label>№ заказа: {formData.order_number}</label>
        </div>
        
        <select value={formData.car_id} onChange={(e) => setFormData({ ...formData, car_id: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
          <option value={0}>Выберите автомобиль</option>
          {cars.map(car => <option key={car.id} value={car.id}>{car.brand} {car.model} ({car.plate_number})</option>)}
        </select>
        
        <select value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
          <option value={0}>Выберите работника</option>
          {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.position})</option>)}
        </select>
        
        <textarea placeholder="Примечания клиента" rows={3} value={formData.client_notes || ''} onChange={(e) => setFormData({ ...formData, client_notes: e.target.value })} style={{ width: '100%', marginBottom: '10px' }} />
        
        <h4>Услуги</h4>
        <select onChange={(e) => {
          const service = services.find(s => s.id === parseInt(e.target.value));
          if (service) addService(service);
          e.target.value = '';
        }} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
          <option value="">-- Добавить услугу --</option>
          {services.map(service => <option key={service.id} value={service.id}>{service.name} - {service.total_price} ₽</option>)}
        </select>
        
        {selectedServices.map((s, i) => {
          const service = services.find(srv => srv.id === s.service_id);
          return (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '5px', alignItems: 'center' }}>
              <span style={{ flex: 2 }}>{service?.name}</span>
              <input type="number" min="1" value={s.quantity} onChange={(e) => updateServiceQuantity(i, parseInt(e.target.value))} style={{ width: '80px' }} />
              <span style={{ width: '100px' }}>{(service ? service.total_price * s.quantity : 0)} ₽</span>
              <button className="delete-btn" onClick={() => removeService(i)}>Удалить</button>
            </div>
          );
        })}
        
        <h4>Дефекты</h4>
        <select onChange={(e) => {
          const defect = defects.find(d => d.id === parseInt(e.target.value));
          if (defect) addDefect(defect);
          e.target.value = '';
        }} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
          <option value="">-- Добавить дефект --</option>
          {defects.map(defect => <option key={defect.id} value={defect.id}>{defect.code} - {defect.description}</option>)}
        </select>
        
        {selectedDefects.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '5px', alignItems: 'center' }}>
            <span style={{ flex: 2 }}>{defects.find(def => def.id === d.defect_id)?.code}</span>
            <input type="text" placeholder="Примечание" value={d.notes} onChange={(e) => updateDefectNotes(i, e.target.value)} style={{ flex: 3 }} />
            <button className="delete-btn" onClick={() => removeDefect(i)}>Удалить</button>
          </div>
        ))}
        
        <div className="modal-buttons">
          <button onClick={onClose}>Отмена</button>
          <button className="add-btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Создание...' : 'Создать заказ'}</button>
        </div>
      </div>
    </div>
  );
};

export default RepairOrderForm;