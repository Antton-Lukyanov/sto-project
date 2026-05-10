import { useState, useEffect } from 'react';
import { getClients, deleteClient, createClient, updateClient } from '../api/client';
import { Client } from '../types';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<Client, 'id' | 'cars' | 'cars_count' | 'created_at'>) => {
    await createClient(data);
    await load();
  };

  const update = async (id: number, data: Partial<Client>) => {
    await updateClient(id, data);
    await load();
  };

  const remove = async (id: number) => {
    await deleteClient(id);
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return { clients, loading, error, load, add, update, remove };
};