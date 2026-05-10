import { Router } from "express";
import { InvoiceController } from "../controllers/invoiceController";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const controller = new InvoiceController();

router.get("/order/:orderId", authMiddleware, controller.getByOrderId.bind(controller));
router.post("/order/:orderId/generate", authMiddleware, controller.generate.bind(controller));
router.put("/:id/status", authMiddleware, controller.updateStatus.bind(controller));
router.get("/order/:orderId/report", authMiddleware, controller.getClientReport.bind(controller));

export default router;