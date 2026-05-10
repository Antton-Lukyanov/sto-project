import { Request, Response } from "express";
import { DefectService } from "../services/defectService";

const defectService = new DefectService();

export class DefectController {
  async getAll(req: Request, res: Response) {
    const defects = await defectService.getAllDefects();
    res.json(defects);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const defect = await defectService.getDefectById(id);
    if (!defect) {
      return res.status(404).json({ error: "Дефект не найден" });
    }
    res.json(defect);
  }

  async getByCode(req: Request, res: Response) {
    const code = req.params.code;
    const defect = await defectService.getDefectByCode(code);
    if (!defect) {
      return res.status(404).json({ error: "Дефект не найден" });
    }
    res.json(defect);
  }

  async create(req: Request, res: Response) {
    const { code, description, category } = req.body;

    if (!code || !description) {
      return res.status(400).json({ error: "Код и описание дефекта обязательны" });
    }

    const existing = await defectService.getDefectByCode(code);
    if (existing) {
      return res.status(400).json({ error: "Дефект с таким кодом уже существует" });
    }

    const defect = await defectService.createDefect({ code, description, category });
    res.status(201).json(defect);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const defect = await defectService.updateDefect(id, req.body);
    if (!defect) {
      return res.status(404).json({ error: "Дефект не найден" });
    }
    res.json(defect);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    const usageCount = await defectService.getDefectUsageCount(id);
    if (usageCount > 0) {
      return res.status(400).json({
        error: `Невозможно удалить дефект, он используется в ${usageCount} заказах`
      });
    }

    await defectService.deleteDefect(id);
    res.status(204).send();
  }

  async getByCategory(req: Request, res: Response) {
    const category = req.params.category;
    const defects = await defectService.getDefectsByCategory(category);
    res.json(defects);
  }
}