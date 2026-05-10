export interface Client {
  id: number;
  passport_series: string;
  passport_number: string;
  full_name: string;
  birth_year: number;
  created_at?: Date;
}

export interface ClientWithCars extends Client {
  cars_count?: number;
  cars?: Car[];
}

import { Car } from "./Car";