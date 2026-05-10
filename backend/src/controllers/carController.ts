import { Request, Response } from "express";
import { CarService } from "../services/carService";

const carService = new CarService();

export class CarController {
  async getAll(req: Request, res: Response) {
    const cars = await carService.getAllCars();
    res.json(cars);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const car = await carService.getCarById(id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  }

  async addToClient(req: Request, res: Response) {
    const clientId = parseInt(req.params.clientId);
    const car = await carService.addCarToClient(clientId, req.body);
    res.status(201).json(car);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const car = await carService.updateCar(id, req.body);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await carService.deleteCar(id);
    res.status(204).send();
  }

  async getByPlate(req: Request, res: Response) {
    const plate = req.query.plate as string;
    const car = await carService.getCarByPlate(plate);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  }
}