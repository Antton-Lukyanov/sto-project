import { Router } from "express";
import { DefectController } from "../controllers/defectController";
import { authMiddleware } from "../middleware/auth";
import { adminOnly } from "../middleware/roleCheck";

const router = Router();
const controller = new DefectController();

// GET /api/defects - все дефекты
router.get("/", authMiddleware, controller.getAll.bind(controller));

// GET /api/defects/:id - дефект по ID
router.get("/:id", authMiddleware, controller.getById.bind(controller));

// GET /api/defects/code/:code - дефект по коду
router.get("/code/:code", authMiddleware, controller.getByCode.bind(controller));

// GET /api/defects/category/:category - дефекты по категории
router.get("/category/:category", authMiddleware, controller.getByCategory.bind(controller));

// POST /api/defects - создать дефект (только админ)
router.post("/", authMiddleware, adminOnly, controller.create.bind(controller));

// PUT /api/defects/:id - обновить дефект (только админ)
router.put("/:id", authMiddleware, adminOnly, controller.update.bind(controller));

// DELETE /api/defects/:id - удалить дефект (только админ)
router.delete("/:id", authMiddleware, adminOnly, controller.delete.bind(controller));

export default router;