import { Router } from "express";
import { RepairController } from "../controllers/repairController";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const controller = new RepairController();

router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.post("/", authMiddleware, controller.create.bind(controller));
router.put("/:id", authMiddleware, controller.update.bind(controller));
router.post("/:id/services", authMiddleware, controller.addService.bind(controller));
router.post("/:id/defects", authMiddleware, controller.addDefect.bind(controller));
router.get("/:id/services", authMiddleware, controller.getServices.bind(controller));
router.get("/:id/defects", authMiddleware, controller.getDefects.bind(controller));

export default router;