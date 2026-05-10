export interface Employee {
  id: number;
  passport_series: string;
  passport_number: string;
  full_name: string;
  birth_year: number | null;
  position: string;
  rank: number;
  login: string;
  password_hash: string;
  role: "worker" | "admin";
  hired_at?: Date;
}

export interface EmployeeWithStats extends Employee {
  total_earnings?: number;
  repairs_count?: number;
}