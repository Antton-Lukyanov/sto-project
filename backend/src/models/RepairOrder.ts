export interface RepairOrder {
  id: number;
  order_number: string;
  date: Date;
  car_id: number;
  employee_id: number;
  client_notes: string | null;
  status: "in_progress" | "completed" | "archived";
  total_labor_cost: number;
  total_parts_cost: number;
  total_amount: number;
  completed_at: Date | null;
  is_archived: boolean;
  created_at?: Date;
}

export interface RepairOrderDetails extends RepairOrder {
  car?: Car;
  employee?: Employee;
}

import { Car } from "./Car";
import { Employee } from "./Employee";