import { Request, Response } from "express";
import { EmployeeService } from "../services/employeeService";

const employeeService = new EmployeeService();

export class EmployeeController {
  async getAll(req: Request, res: Response) {
    const user = (req as any).user;
    let employees;
    if (user.role === "admin") {
      employees = await employeeService.getAllEmployees();
    } else {
      employees = [await employeeService.getEmployeeById(user.id)];
    }
    res.json(employees);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = (req as any).user;
    if (user.role !== "admin" && user.id !== id) {
      return res.status(403).json({ error: "Access denied" });
    }
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  }

  async create(req: Request, res: Response) {
    const { password, ...employeeData } = req.body;
    const employee = await employeeService.createEmployee(employeeData, password);
    res.status(201).json(employee);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = (req as any).user;
    if (user.role !== "admin" && user.id !== id) {
      return res.status(403).json({ error: "Access denied" });
    }
    const employee = await employeeService.updateEmployee(id, req.body);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await employeeService.deleteEmployee(id);
    res.status(204).send();
  }
}