export interface Service {
  id: number;
  code: string;
  name: string;
  description: string | null;
  labor_hours: number;
  labor_rate: number;
  total_price: number;
  category: string;
  is_active: boolean;
}