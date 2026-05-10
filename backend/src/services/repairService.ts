import { pool } from "../config/database";
import { RepairOrder, RepairOrderDetails } from "../models/RepairOrder";

export class RepairService {
  async getAllRepairOrders(onlyArchived: boolean = false): Promise<RepairOrderDetails[]> {
    const result = await pool.query(`
      SELECT ro.*,
             json_build_object('id', c.id, 'plate', c.plate_number, 'brand', c.brand, 'model', c.model) as car,
             json_build_object('id', e.id, 'name', e.full_name, 'position', e.position) as employee
      FROM repair_orders ro
      LEFT JOIN cars c ON ro.car_id = c.id
      LEFT JOIN employees e ON ro.employee_id = e.id
      WHERE ro.is_archived = $1
      ORDER BY ro.id DESC
    `, [onlyArchived]);
    return result.rows;
  }

  async getRepairOrderById(id: number): Promise<RepairOrderDetails | null> {
    const result = await pool.query(`
      SELECT ro.*,
             json_build_object('id', c.id, 'plate', c.plate_number, 'brand', c.brand, 'model', c.model) as car,
             json_build_object('id', e.id, 'name', e.full_name, 'position', e.position) as employee
      FROM repair_orders ro
      LEFT JOIN cars c ON ro.car_id = c.id
      LEFT JOIN employees e ON ro.employee_id = e.id
      WHERE ro.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async getRepairOrdersByCarId(carId: number): Promise<RepairOrderDetails[]> {
    const result = await pool.query(`
      SELECT ro.*,
             json_build_object('id', e.id, 'name', e.full_name, 'position', e.position) as employee
      FROM repair_orders ro
      LEFT JOIN employees e ON ro.employee_id = e.id
      WHERE ro.car_id = $1
      ORDER BY ro.id DESC
    `, [carId]);
    return result.rows;
  }

  async createRepairOrder(orderData: Omit<RepairOrder, "id" | "created_at" | "total_amount">): Promise<RepairOrder> {
    const { order_number, date, car_id, employee_id, client_notes, status, total_labor_cost, total_parts_cost, completed_at, is_archived } = orderData;
    const result = await pool.query(`
      INSERT INTO repair_orders (order_number, date, car_id, employee_id, client_notes, status, total_labor_cost, total_parts_cost, completed_at, is_archived)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [order_number, date, car_id, employee_id, client_notes, status, total_labor_cost, total_parts_cost, completed_at, is_archived]);
    return result.rows[0];
  }

  async updateRepairOrder(id: number, orderData: Partial<RepairOrder>): Promise<RepairOrder | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (orderData.status !== undefined) { fields.push(`status = $${idx}`); values.push(orderData.status); idx++; }
    if (orderData.total_labor_cost !== undefined) { fields.push(`total_labor_cost = $${idx}`); values.push(orderData.total_labor_cost); idx++; }
    if (orderData.total_parts_cost !== undefined) { fields.push(`total_parts_cost = $${idx}`); values.push(orderData.total_parts_cost); idx++; }
    if (orderData.completed_at !== undefined) { fields.push(`completed_at = $${idx}`); values.push(orderData.completed_at); idx++; }
    if (orderData.is_archived !== undefined) { fields.push(`is_archived = $${idx}`); values.push(orderData.is_archived); idx++; }
    if (fields.length === 0) return null;
    values.push(id);
    const query = `UPDATE repair_orders SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async addServiceToOrder(orderId: number, serviceId: number, quantity: number, unitPrice: number): Promise<void> {
    await pool.query(`
      INSERT INTO order_services (order_id, service_id, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
    `, [orderId, serviceId, quantity, unitPrice]);
  }

  async addDefectToOrder(orderId: number, defectId: number, notes: string | null): Promise<void> {
    await pool.query(`
      INSERT INTO order_defects (order_id, defect_id, notes)
      VALUES ($1, $2, $3)
    `, [orderId, defectId, notes]);
  }

  async getOrderServices(orderId: number): Promise<any[]> {
    const result = await pool.query(`
      SELECT os.*, s.name, s.code, s.category
      FROM order_services os
      JOIN services s ON os.service_id = s.id
      WHERE os.order_id = $1
    `, [orderId]);
    return result.rows;
  }

  async getOrderDefects(orderId: number): Promise<any[]> {
    const result = await pool.query(`
      SELECT od.*, d.code, d.description, d.category
      FROM order_defects od
      JOIN defects d ON od.defect_id = d.id
      WHERE od.order_id = $1
    `, [orderId]);
    return result.rows;
  }
}