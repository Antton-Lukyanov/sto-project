import { pool } from "../config/database";

export class ReportService {
  async getTopDefectByBrand(brand: string): Promise<any> {
    const result = await pool.query(`
      SELECT d.id, d.code, d.description, d.category, COUNT(*) as occurrence_count
      FROM defects d
      JOIN order_defects od ON d.id = od.defect_id
      JOIN repair_orders ro ON od.order_id = ro.id
      JOIN cars c ON ro.car_id = c.id
      WHERE LOWER(c.brand) = LOWER($1)
      GROUP BY d.id, d.code, d.description, d.category
      ORDER BY occurrence_count DESC
      LIMIT 1
    `, [brand]);
    return result.rows[0] || null;
  }

  async getTopEmployee(): Promise<any> {
    const result = await pool.query(`
      SELECT e.id, e.full_name, e.position, e.rank,
             COUNT(ro.id) as total_repairs,
             COALESCE(SUM(ro.total_amount), 0) as total_earnings
      FROM employees e
      JOIN repair_orders ro ON e.id = ro.employee_id
      GROUP BY e.id
      ORDER BY total_earnings DESC
      LIMIT 1
    `);
    return result.rows[0];
  }

  async getDefectsByClient(clientId: number): Promise<any[]> {
    const result = await pool.query(`
      SELECT d.code, d.description, ro.order_number, ro.date,
             ro.total_labor_cost, ro.total_parts_cost, ro.total_amount
      FROM repair_orders ro
      JOIN cars c ON ro.car_id = c.id
      JOIN order_defects od ON ro.id = od.order_id
      JOIN defects d ON od.defect_id = d.id
      WHERE c.client_id = $1 AND ro.is_archived = true
      ORDER BY ro.date DESC
    `, [clientId]);
    return result.rows;
  }

  async getClientsByDefect(defectCode: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT DISTINCT c.id, c.full_name, c.passport_series, c.passport_number
      FROM clients c
      JOIN cars car ON c.id = car.client_id
      JOIN repair_orders ro ON car.id = ro.car_id
      JOIN order_defects od ON ro.id = od.order_id
      JOIN defects d ON od.defect_id = d.id
      WHERE d.code = $1
    `, [defectCode]);
    return result.rows;
  }

  async getEmployeesByCarPlate(plateNumber: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT DISTINCT e.id, e.full_name, e.position, e.rank
      FROM employees e
      JOIN repair_orders ro ON e.id = ro.employee_id
      JOIN cars c ON ro.car_id = c.id
      WHERE c.plate_number = $1
    `, [plateNumber]);
    return result.rows;
  }

  async getCarsByClient(clientId: number): Promise<any[]> {
    const result = await pool.query(`
      SELECT id, brand, model, year, plate_number, vin_code, color
      FROM cars
      WHERE client_id = $1
    `, [clientId]);
    return result.rows;
  }

  async getEmployeeStats(employeeId: number, startDate?: string, endDate?: string): Promise<any> {
    let query = `
      SELECT
        COUNT(ro.id) as total_repairs,
        COALESCE(SUM(ro.total_amount), 0) as total_earnings,
        COALESCE(AVG(ro.total_amount), 0) as avg_order_value
      FROM repair_orders ro
      WHERE ro.employee_id = $1
    `;
    const params: any[] = [employeeId];
    if (startDate && endDate) {
      query += ` AND ro.date BETWEEN $2 AND $3`;
      params.push(startDate, endDate);
    }
    const result = await pool.query(query, params);
    return result.rows[0];
  }
}