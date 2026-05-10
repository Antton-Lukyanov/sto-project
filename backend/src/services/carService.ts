import { pool } from "../config/database";
import { Car } from "../models/Car";

export class CarService {
  async getAllCars(): Promise<Car[]> {
    const result = await pool.query(`
      SELECT c.*, cl.full_name as client_full_name
      FROM cars c
      LEFT JOIN clients cl ON c.client_id = cl.id
      ORDER BY c.id
    `);
    return result.rows;
  }

  async getCarById(id: number): Promise<Car | null> {
    const result = await pool.query("SELECT * FROM cars WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  async addCarToClient(clientId: number, carData: Omit<Car, "id" | "client_id" | "created_at">): Promise<Car> {
    const { plate_number, vin_code, brand, model, year, color } = carData;
    const result = await pool.query(`
      INSERT INTO cars (plate_number, vin_code, brand, model, year, color, client_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [plate_number, vin_code, brand, model, year, color, clientId]);
    return result.rows[0];
  }

  async updateCar(id: number, carData: Partial<Car>): Promise<Car | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (carData.plate_number !== undefined) { fields.push(`plate_number = $${idx}`); values.push(carData.plate_number); idx++; }
    if (carData.vin_code !== undefined) { fields.push(`vin_code = $${idx}`); values.push(carData.vin_code); idx++; }
    if (carData.brand !== undefined) { fields.push(`brand = $${idx}`); values.push(carData.brand); idx++; }
    if (carData.model !== undefined) { fields.push(`model = $${idx}`); values.push(carData.model); idx++; }
    if (carData.year !== undefined) { fields.push(`year = $${idx}`); values.push(carData.year); idx++; }
    if (carData.color !== undefined) { fields.push(`color = $${idx}`); values.push(carData.color); idx++; }
    if (fields.length === 0) return null;
    values.push(id);
    const query = `UPDATE cars SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteCar(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM cars WHERE id = $1 RETURNING id", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async getCarByPlate(plate: string): Promise<Car | null> {
    const result = await pool.query("SELECT * FROM cars WHERE plate_number = $1", [plate]);
    return result.rows[0] || null;
  }

  async getCarByVin(vin: string): Promise<Car | null> {
    const result = await pool.query("SELECT * FROM cars WHERE vin_code = $1", [vin]);
    return result.rows[0] || null;
  }
}