import React, { useEffect, useState } from 'react';
import { getDefects } from '../../api/client';
import { Defect } from '../../types';

const DefectList: React.FC = () => {
  const [defects, setDefects] = useState<Defect[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      const res = await getDefects();
      setDefects(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const categories = ['all', ...new Set(defects.map(d => d.category || 'Другое'))];
  const filtered = category === 'all' ? defects : defects.filter(d => (d.category || 'Другое') === category);

  if (loading) return <div>Загрузка...</div>;

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
              <th>Описание</th>
              <th>Категория</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(defect => (
              <tr key={defect.id}>
                <td><strong>{defect.code}</strong></td>
                <td>{defect.description}</td>
                <td>{defect.category || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DefectList;