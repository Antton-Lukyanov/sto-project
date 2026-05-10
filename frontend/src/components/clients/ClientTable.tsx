import React, { useState } from 'react';
import { Client } from '../../types';
import ClientCars from './ClientCars';

interface ClientTableProps {
  clients: Client[];
  onDelete: (id: number) => void;
  onEdit: (client: Client) => void;
  onRefresh: () => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onDelete, onEdit, onRefresh }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Паспорт</th>
              <th>Год рождения</th>
              <th>Автомобилей</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>
                  <button
                    style={{ background: 'none', color: '#3498db', padding: 0, fontSize: 'inherit' }}
                    onClick={() => setSelectedClient(client)}
                  >
                    {client.full_name}
                  </button>
                </td>
                <td>{client.passport_series} {client.passport_number}</td>
                <td>{client.birth_year}</td>
                <td>{client.cars?.length || client.cars_count || 0}</td>
                <td>
                  <button onClick={() => onEdit(client)}>✏️</button>
                  <button className="delete-btn" onClick={() => onDelete(client.id)}>🗑</button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>Нет клиентов</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <ClientCars
          clientId={selectedClient.id}
          clientName={selectedClient.full_name}
          onClose={() => setSelectedClient(null)}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};

export default ClientTable;