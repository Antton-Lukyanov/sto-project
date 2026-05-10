import { Router } from "express";
import { CarController } from "../controllers/carController";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const controller = new CarController();

router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.post("/client/:clientId", authMiddleware, controller.addToClient.bind(controller));
router.put("/:id", authMiddleware, controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));
router.get("/by-plate", authMiddleware, controller.getByPlate.bind(controller));

export default router;