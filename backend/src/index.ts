import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRouter from "./routes/auth";
import clientsRouter from "./routes/clients";
import carsRouter from "./routes/cars";
import employeesRouter from "./routes/employees";
import servicesRouter from "./routes/services";
import defectsRouter from "./routes/defects";
import repairOrdersRouter from "./routes/repairOrders";
import invoicesRouter from "./routes/invoices";
import reportsRouter from "./routes/reports";

import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
});
app.use("/api", limiter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/cars", carsRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/services", servicesRouter);
app.use("/api/defects", defectsRouter);
app.use("/api/repair-orders", repairOrdersRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/reports", reportsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("  POST /api/auth/login");
  console.log("  GET  /api/clients");
  console.log("  GET  /api/cars");
  console.log("  GET  /api/employees");
  console.log("  GET  /api/services");
  console.log("  GET  /api/defects");
  console.log("  GET  /api/repair-orders");
  console.log("  GET  /api/reports/top-employee");
});