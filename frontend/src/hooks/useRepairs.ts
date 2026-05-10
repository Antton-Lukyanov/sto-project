import { useState, useEffect } from 'react';
import { getRepairOrders, createRepairOrder, updateRepairOrder } from '../api/client';
import { RepairOrder } from '../types';

export const useRepairs = (archived: boolean = false) => {
  const [repairs, setRepairs] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const response = await getRepairOrders(archived);
      setRepairs(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: Omit<RepairOrder, 'id' | 'created_at' | 'total_amount'>) => {
    await createRepairOrder(data);
    await load();
  };

  const update = async (id: number, data: Partial<RepairOrder>) => {
    await updateRepairOrder(id, data);
    await load();
  };

  useEffect(() => {
    load();
  }, [archived]);

  return { repairs, loading, error, load, add, update };
};