import { Router } from "express";
import { ClientController } from "../controllers/clientController";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const controller = new ClientController();

router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.post("/", authMiddleware, controller.create.bind(controller));
router.put("/:id", authMiddleware, controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));
router.get("/:id/cars", authMiddleware, controller.getCars.bind(controller));

export default router;