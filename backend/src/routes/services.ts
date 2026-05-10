import { Router } from "express";
import { pool } from "../config/database";
import { authMiddleware } from "../middleware/auth";
import { adminOnly } from "../middleware/roleCheck";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const result = await pool.query("SELECT * FROM services WHERE is_active = true ORDER BY category, code");
  res.json(result.rows);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const result = await pool.query("SELECT * FROM services WHERE id = $1", [req.params.id]);
  res.json(result.rows[0] || null);
});

router.post("/", authMiddleware, adminOnly, async (req, res) => {
  const { code, name, description, labor_hours, labor_rate, category } = req.body;
  const result = await pool.query(
    `INSERT INTO services (code, name, description, labor_hours, labor_rate, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [code, name, description, labor_hours, labor_rate, category]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  const { name, description, labor_hours, labor_rate, category, is_active } = req.body;
  const result = await pool.query(
    `UPDATE services SET name = $1, description = $2, labor_hours = $3, labor_rate = $4, category = $5, is_active = $6 WHERE id = $7 RETURNING *`,
    [name, description, labor_hours, labor_rate, category, is_active, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  await pool.query("UPDATE services SET is_active = false WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

export default router;