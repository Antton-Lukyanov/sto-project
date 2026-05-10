import { Request, Response } from "express";
import { RepairService } from "../services/repairService";

const repairService = new RepairService();

export class RepairController {
  async getAll(req: Request, res: Response) {
    const onlyArchived = req.query.archived === "true";
    const orders = await repairService.getAllRepairOrders(onlyArchived);
    res.json(orders);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const order = await repairService.getRepairOrderById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  }

  async create(req: Request, res: Response) {
    const order = await repairService.createRepairOrder(req.body);
    res.status(201).json(order);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const order = await repairService.updateRepairOrder(id, req.body);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  }

  async addService(req: Request, res: Response) {
    const orderId = parseInt(req.params.id);
    const { service_id, quantity, unit_price } = req.body;
    await repairService.addServiceToOrder(orderId, service_id, quantity, unit_price);
    res.status(201).json({ message: "Service added" });
  }

  async addDefect(req: Request, res: Response) {
    const orderId = parseInt(req.params.id);
    const { defect_id, notes } = req.body;
    await repairService.addDefectToOrder(orderId, defect_id, notes);
    res.status(201).json({ message: "Defect added" });
  }

  async getServices(req: Request, res: Response) {
    const orderId = parseInt(req.params.id);
    const services = await repairService.getOrderServices(orderId);
    res.json(services);
  }

  async getDefects(req: Request, res: Response) {
    const orderId = parseInt(req.params.id);
    const defects = await repairService.getOrderDefects(orderId);
    res.json(defects);
  }
}