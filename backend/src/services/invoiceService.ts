import { pool } from "../config/database";
import { Invoice, InvoiceWithOrder } from "../models/Invoice";

export class InvoiceService {
  async getInvoiceByOrderId(orderId: number): Promise<InvoiceWithOrder | null> {
    const result = await pool.query(`
      SELECT i.*,
             json_build_object(
               'id', ro.id,
               'order_number', ro.order_number,
               'date', ro.date,
               'total_amount', ro.total_amount,
               'status', ro.status
             ) as repair_order
      FROM invoices i
      JOIN repair_orders ro ON i.order_id = ro.id
      WHERE i.order_id = $1
    `, [orderId]);
    return result.rows[0] || null;
  }

  async generateInvoice(orderId: number): Promise<Invoice> {
    const invoiceNumber = "INV-" + Date.now();
    const result = await pool.query(`
      INSERT INTO invoices (order_id, invoice_number, issued_date, payment_status)
      VALUES ($1, $2, CURRENT_DATE, $3)
      RETURNING *
    `, [orderId, invoiceNumber, "pending"]);
    return result.rows[0];
  }

  async updatePaymentStatus(invoiceId: number, status: "pending" | "paid" | "overdue"): Promise<Invoice | null> {
    const result = await pool.query(`
      UPDATE invoices SET payment_status = $1 WHERE id = $2 RETURNING *
    `, [status, invoiceId]);
    return result.rows[0] || null;
  }

  async getClientReport(orderId: number): Promise<any> {
    const result = await pool.query(`
      SELECT
        c.id as client_id, c.full_name as client_name, c.passport_series, c.passport_number,
        car.id as car_id, car.brand, car.model, car.plate_number, car.vin_code,
        ro.order_number, ro.date, ro.total_labor_cost, ro.total_parts_cost, ro.total_amount,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'service_id', s.id, 'code', s.code, 'name', s.name,
            'quantity', os.quantity, 'price', os.unit_price, 'total', os.total
          )) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) as services,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'defect_id', d.id, 'code', d.code, 'description', d.description
          )) FILTER (WHERE d.id IS NOT NULL), '[]'
        ) as defects
      FROM repair_orders ro
      JOIN cars car ON ro.car_id = car.id
      JOIN clients c ON car.client_id = c.id
      LEFT JOIN order_services os ON ro.id = os.order_id
      LEFT JOIN services s ON os.service_id = s.id
      LEFT JOIN order_defects od ON ro.id = od.order_id
      LEFT JOIN defects d ON od.defect_id = d.id
      WHERE ro.id = $1
      GROUP BY c.id, car.id, ro.id
    `, [orderId]);
    return result.rows[0];
  }
}