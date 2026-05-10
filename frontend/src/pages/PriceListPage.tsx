import React, { useState } from 'react';
import PriceList from '../components/services/PriceList';
import ServiceForm from '../components/services/ServiceForm';
import RoleGuard from '../components/common/RoleGuard';

const PriceListPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Прайс-лист услуг</h1>
        <RoleGuard allowedRoles={['admin']}>
          <button className="add-btn" onClick={() => setShowForm(true)}>➕ Добавить услугу</button>
        </RoleGuard>
      </div>
      
      <PriceList key={refreshKey} />
      
      {showForm && (
        <ServiceForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
};

export default PriceListPage;