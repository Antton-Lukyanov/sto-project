import { Router } from "express";
import { ReportController } from "../controllers/reportController";
import { authMiddleware } from "../middleware/auth";
import { adminOnly } from "../middleware/roleCheck";

const router = Router();
const controller = new ReportController();

router.get("/top-defect", authMiddleware, controller.getTopDefectByBrand.bind(controller));
router.get("/top-employee", authMiddleware, adminOnly, controller.getTopEmployee.bind(controller));
router.get("/defects-by-client/:clientId", authMiddleware, controller.getDefectsByClient.bind(controller));
router.get("/clients-by-defect/:defectCode", authMiddleware, controller.getClientsByDefect.bind(controller));
router.get("/employees-by-car", authMiddleware, controller.getEmployeesByCarPlate.bind(controller));
router.get("/cars-by-client/:clientId", authMiddleware, controller.getCarsByClient.bind(controller));
router.get("/employee-stats/:employeeId", authMiddleware, adminOnly, controller.getEmployeeStats.bind(controller));

export default router;