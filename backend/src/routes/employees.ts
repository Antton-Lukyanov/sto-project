import { Router } from "express";
import { EmployeeController } from "../controllers/employeeController";
import { authMiddleware } from "../middleware/auth";
import { adminOnly } from "../middleware/roleCheck";

const router = Router();
const controller = new EmployeeController();

router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.post("/", authMiddleware, adminOnly, controller.create.bind(controller));
router.put("/:id", authMiddleware, controller.update.bind(controller));
router.delete("/:id", authMiddleware, adminOnly, controller.delete.bind(controller));

export default router;