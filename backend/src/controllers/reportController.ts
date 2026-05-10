import { Request, Response } from "express";
import { ReportService } from "../services/reportService";

const reportService = new ReportService();

export class ReportController {
  async getTopDefectByBrand(req: Request, res: Response) {
    const brand = req.query.brand as string;
    if (!brand) return res.status(400).json({ error: "Brand required" });
    const result = await reportService.getTopDefectByBrand(brand);
    res.json(result);
  }

  async getTopEmployee(req: Request, res: Response) {
    const result = await reportService.getTopEmployee();
    res.json(result);
  }

  async getDefectsByClient(req: Request, res: Response) {
    const clientId = parseInt(req.params.clientId);
    const result = await reportService.getDefectsByClient(clientId);
    res.json(result);
  }

  async getClientsByDefect(req: Request, res: Response) {
    const defectCode = req.params.defectCode;
    const result = await reportService.getClientsByDefect(defectCode);
    res.json(result);
  }

  async getEmployeesByCarPlate(req: Request, res: Response) {
    const plate = req.query.plate as string;
    if (!plate) return res.status(400).json({ error: "Plate required" });
    const result = await reportService.getEmployeesByCarPlate(plate);
    res.json(result);
  }

  async getCarsByClient(req: Request, res: Response) {
    const clientId = parseInt(req.params.clientId);
    const result = await reportService.getCarsByClient(clientId);
    res.json(result);
  }

  async getEmployeeStats(req: Request, res: Response) {
    const employeeId = parseInt(req.params.employeeId);
    const { startDate, endDate } = req.query;
    const result = await reportService.getEmployeeStats(employeeId, startDate as string, endDate as string);
    res.json(result);
  }
}