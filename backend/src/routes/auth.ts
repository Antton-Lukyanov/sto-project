import { Router } from "express";
import { pool } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: "Логин и пароль обязательны" });
  }

  try {
    const result = await pool.query(
      "SELECT id, full_name, login, password_hash, role FROM employees WHERE login = $1",
      [login]
    );

    const employee = result.rows[0];
    if (!employee) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const token = jwt.sign(
      { id: employee.id, login: employee.login, role: employee.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      token: token,
      user: {
        id: employee.id,
        full_name: employee.full_name,
        login: employee.login,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/register", async (req, res) => {
  const { passport_series, passport_number, full_name, birth_year, position, login, password, role } = req.body;

  if (!login || !password || !full_name || !position) {
    return res.status(400).json({ error: "Не все обязательные поля заполнены" });
  }

  try {
    const existing = await pool.query("SELECT id FROM employees WHERE login = $1", [login]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Пользователь с таким логином уже существует" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO employees (passport_series, passport_number, full_name, birth_year, position, login, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, full_name, login, role`,
      [passport_series, passport_number, full_name, birth_year, position, login, password_hash, role || "worker"]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = (decoded as any).id;
    
    const result = await pool.query(
      "SELECT id, full_name, login, role FROM employees WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Неверный токен" });
  }
});

// Эндпоинт для создания админа
router.post("/setup-admin", async (req, res) => {
  try {
    const password_hash = await bcrypt.hash("123456", 10);
    
    await pool.query("DELETE FROM employees WHERE login = 'admin'");
    // Сбрасываем счётчик
    await pool.query("ALTER SEQUENCE employees_id_seq RESTART WITH 1");
    
    const result = await pool.query(
      `INSERT INTO employees (passport_series, passport_number, full_name, birth_year, position, login, password_hash, role)
       VALUES ('5000', '111111', 'Администратор Системы', 1980, 'Администратор', 'admin', $1, 'admin')
       RETURNING id, login, role`,
      [password_hash]
    );
    
    console.log("Admin created with id:", result.rows[0].id);
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка создания админа" });
  }
});

export default router;