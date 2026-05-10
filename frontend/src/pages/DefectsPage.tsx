import React from 'react';
import DefectList from '../components/defects/DefectList';

const DefectsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Справочник дефектов</h1>
      </div>
      <DefectList />
    </div>
  );
};

export default DefectsPage;