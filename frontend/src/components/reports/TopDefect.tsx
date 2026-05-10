import React, { useState } from 'react';
import { getTopDefectByBrand } from '../../api/client';

const TopDefect: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!brand) return;
    setLoading(true);
    const res = await getTopDefectByBrand(brand);
    setResult(res.data);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Марка автомобиля"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={handleSearch} disabled={loading}>Анализировать</button>
      </div>
      
      {result && (
        <div className="result-card">
          <p><strong>Код:</strong> {result.code}</p>
          <p><strong>Описание:</strong> {result.description}</p>
          <p><strong>Категория:</strong> {result.category || '-'}</p>
          <p><strong>Количество случаев:</strong> {result.occurrence_count}</p>
        </div>
      )}
      
      {result === null && !loading && brand && <div>Неисправности не найдены</div>}
    </div>
  );
};

export default TopDefect;