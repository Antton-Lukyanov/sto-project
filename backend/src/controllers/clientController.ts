import { Request, Response } from "express";
import { ClientService } from "../services/clientService";

const clientService = new ClientService();

export class ClientController {
  async getAll(req: Request, res: Response) {
    const clients = await clientService.getAllClients();
    res.json(clients);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const client = await clientService.getClientById(id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  }

  async create(req: Request, res: Response) {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const client = await clientService.updateClient(id, req.body);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await clientService.deleteClient(id);
    res.status(204).send();
  }

  async getCars(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const cars = await clientService.getCarsByClient(id);
    res.json(cars);
  }
}