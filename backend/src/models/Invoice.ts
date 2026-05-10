export interface Invoice {
  id: number;
  order_id: number;
  invoice_number: string;
  issued_date: Date;
  payment_status: "pending" | "paid" | "overdue";
  pdf_path: string | null;
}

export interface InvoiceWithOrder extends Invoice {
  repair_order?: RepairOrder;
}

import { RepairOrder } from "./RepairOrder";