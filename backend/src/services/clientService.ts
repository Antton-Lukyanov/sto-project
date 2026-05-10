import { pool } from "../config/database";
import { Client, ClientWithCars } from "../models/Client";

export class ClientService {
  async getAllClients(): Promise<ClientWithCars[]> {
    const result = await pool.query(`
      SELECT c.*, 
             COUNT(car.id) as cars_count,
             COALESCE(json_agg(json_build_object(
                'id', car.id,
                'plate', car.plate_number,
                'brand', car.brand,
                'model', car.model,
                'year', car.year,
                'color', car.color,
                'vin', car.vin_code
             )) FILTER (WHERE car.id IS NOT NULL), '[]') as cars
      FROM clients c
      LEFT JOIN cars car ON c.id = car.client_id
      GROUP BY c.id
      ORDER BY c.id
    `);
    return result.rows;
  }

  async getClientById(id: number): Promise<ClientWithCars | null> {
    const result = await pool.query(`
      SELECT c.*,
             COUNT(car.id) as cars_count,
             COALESCE(json_agg(json_build_object(
                'id', car.id,
                'plate', car.plate_number,
                'brand', car.brand,
                'model', car.model,
                'year', car.year,
                'color', car.color,
                'vin', car.vin_code
             )) FILTER (WHERE car.id IS NOT NULL), '[]') as cars
      FROM clients c
      LEFT JOIN cars car ON c.id = car.client_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);
    return result.rows[0] || null;
  }

  async createClient(clientData: Omit<Client, "id" | "created_at">): Promise<Client> {
    const { passport_series, passport_number, full_name, birth_year } = clientData;
    const result = await pool.query(`
      INSERT INTO clients (passport_series, passport_number, full_name, birth_year)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [passport_series, passport_number, full_name, birth_year]);
    return result.rows[0];
  }

  async updateClient(id: number, clientData: Partial<Client>): Promise<Client | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (clientData.passport_series !== undefined) { fields.push(`passport_series = $${idx}`); values.push(clientData.passport_series); idx++; }
    if (clientData.passport_number !== undefined) { fields.push(`passport_number = $${idx}`); values.push(clientData.passport_number); idx++; }
    if (clientData.full_name !== undefined) { fields.push(`full_name = $${idx}`); values.push(clientData.full_name); idx++; }
    if (clientData.birth_year !== undefined) { fields.push(`birth_year = $${idx}`); values.push(clientData.birth_year); idx++; }
    if (fields.length === 0) return null;
    values.push(id);
    const query = `UPDATE clients SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM clients WHERE id = $1 RETURNING id", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async getCarsByClient(clientId: number): Promise<any[]> {
    const result = await pool.query("SELECT * FROM cars WHERE client_id = $1 ORDER BY id", [clientId]);
    return result.rows;
  }
}