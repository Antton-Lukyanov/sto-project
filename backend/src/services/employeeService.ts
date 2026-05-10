import { pool } from "../config/database";
import bcrypt from "bcryptjs";
import { Employee, EmployeeWithStats } from "../models/Employee";

export class EmployeeService {
  async getAllEmployees(): Promise<EmployeeWithStats[]> {
    const result = await pool.query(`
      SELECT e.id, e.passport_series, e.passport_number, e.full_name,
             e.birth_year, e.position, e.rank, e.login, e.role, e.hired_at,
             COUNT(ro.id) as repairs_count,
             COALESCE(SUM(ro.total_amount), 0) as total_earnings
      FROM employees e
      LEFT JOIN repair_orders ro ON e.id = ro.employee_id
      GROUP BY e.id
      ORDER BY e.id
    `);
    return result.rows;
  }

  async getEmployeeById(id: number): Promise<EmployeeWithStats | null> {
    const result = await pool.query(`
      SELECT e.*,
             COUNT(ro.id) as repairs_count,
             COALESCE(SUM(ro.total_amount), 0) as total_earnings
      FROM employees e
      LEFT JOIN repair_orders ro ON e.id = ro.employee_id
      WHERE e.id = $1
      GROUP BY e.id
    `, [id]);
    return result.rows[0] || null;
  }

  async getEmployeeByLogin(login: string): Promise<Employee | null> {
    const result = await pool.query("SELECT * FROM employees WHERE login = $1", [login]);
    return result.rows[0] || null;
  }

  async createEmployee(employeeData: Omit<Employee, "id" | "hired_at">, password: string): Promise<Employee> {
    const { passport_series, passport_number, full_name, birth_year, position, rank, login, role } = employeeData;
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(`
      INSERT INTO employees (passport_series, passport_number, full_name, birth_year, position, rank, login, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [passport_series, passport_number, full_name, birth_year, position, rank, login, password_hash, role]);
    const { password_hash: _, ...employee } = result.rows[0];
    return employee;
  }

  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (employeeData.passport_series !== undefined) { fields.push(`passport_series = $${idx}`); values.push(employeeData.passport_series); idx++; }
    if (employeeData.passport_number !== undefined) { fields.push(`passport_number = $${idx}`); values.push(employeeData.passport_number); idx++; }
    if (employeeData.full_name !== undefined) { fields.push(`full_name = $${idx}`); values.push(employeeData.full_name); idx++; }
    if (employeeData.birth_year !== undefined) { fields.push(`birth_year = $${idx}`); values.push(employeeData.birth_year); idx++; }
    if (employeeData.position !== undefined) { fields.push(`position = $${idx}`); values.push(employeeData.position); idx++; }
    if (employeeData.rank !== undefined) { fields.push(`rank = $${idx}`); values.push(employeeData.rank); idx++; }
    if (employeeData.role !== undefined) { fields.push(`role = $${idx}`); values.push(employeeData.role); idx++; }
    if (fields.length === 0) return null;
    values.push(id);
    const query = `UPDATE employees SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    if (!result.rows[0]) return null;
    const { password_hash: _, ...employee } = result.rows[0];
    return employee;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM employees WHERE id = $1 RETURNING id", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async verifyPassword(employee: Employee, password: string): Promise<boolean> {
    return bcrypt.compare(password, employee.password_hash);
  }
}