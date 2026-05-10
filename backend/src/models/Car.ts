export interface Car {
  id: number;
  plate_number: string;
  vin_code: string;
  brand: string;
  model: string;
  year: number;
  color: string | null;
  client_id: number;
  created_at?: Date;
}

export interface CarWithClient extends Car {
  client_full_name?: string;
}