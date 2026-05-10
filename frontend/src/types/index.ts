export interface Client {
  id: number;
  passport_series: string;
  passport_number: string;
  full_name: string;
  birth_year: number;
  cars_count?: number;
  cars?: Car[];
  created_at?: string;
}

export interface Car {
  id: number;
  plate_number: string;
  vin_code: string;
  brand: string;
  model: string;
  year: number;
  color: string | null;
  client_id: number;
  client_full_name?: string;
  created_at?: string;
}

export interface Employee {
  id: number;
  passport_series: string;
  passport_number: string;
  full_name: string;
  birth_year: number | null;
  position: string;
  rank: number;
  login: string;
  role: 'worker' | 'admin';
  hired_at?: string;
  repairs_count?: number;
  total_earnings?: number;
}

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

export interface Defect {
  id: number;
  code: string;
  description: string;
  category: string | null;
}

export interface RepairOrder {
  id: number;
  order_number: string;
  date: string;
  car_id: number;
  employee_id: number;
  client_notes: string | null;
  status: 'in_progress' | 'completed' | 'archived';
  total_labor_cost: number;
  total_parts_cost: number;
  total_amount: number;
  completed_at: string | null;
  is_archived: boolean;
  car?: Car;
  employee?: Employee;
}

export interface Invoice {
  id: number;
  order_id: number;
  invoice_number: string;
  issued_date: string;
  payment_status: 'pending' | 'paid' | 'overdue';
  pdf_path: string | null;
}