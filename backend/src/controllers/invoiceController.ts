import { Request, Response } from "express";
import { InvoiceService } from "../services/invoiceService";

const invoiceService = new InvoiceService();

export class InvoiceController {
  async getByOrderId(req: Request, res: Response) {
    const orderId = parseInt(req.params.orderId);
    const invoice = await invoiceService.getInvoiceByOrderId(orderId);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  }

  async generate(req: Request, res: Response) {
    const orderId = parseInt(req.params.orderId);
    const invoice = await invoiceService.generateInvoice(orderId);
    res.status(201).json(invoice);
  }

  async updateStatus(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const invoice = await invoiceService.updatePaymentStatus(id, status);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  }

  async getClientReport(req: Request, res: Response) {
    const orderId = parseInt(req.params.orderId);
    const report = await invoiceService.getClientReport(orderId);
    if (!report) return res.status(404).json({ error: "Order not found" });
    res.json(report);
  }
}