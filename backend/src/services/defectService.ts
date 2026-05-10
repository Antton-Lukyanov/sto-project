import { pool } from "../config/database";
import { Defect, DefectWithCount } from "../models/Defect";

export class DefectService {
  async getAllDefects(): Promise<Defect[]> {
    const result = await pool.query(`
      SELECT * FROM defects ORDER BY category, code
    `);
    return result.rows;
  }

  async getDefectById(id: number): Promise<Defect | null> {
    const result = await pool.query("SELECT * FROM defects WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  async getDefectByCode(code: string): Promise<Defect | null> {
    const result = await pool.query("SELECT * FROM defects WHERE code = $1", [code]);
    return result.rows[0] || null;
  }

  async createDefect(defectData: Omit<Defect, "id">): Promise<Defect> {
    const { code, description, category } = defectData;
    const result = await pool.query(
      `INSERT INTO defects (code, description, category)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [code.toUpperCase(), description, category || null]
    );
    return result.rows[0];
  }

  async updateDefect(id: number, defectData: Partial<Defect>): Promise<Defect | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (defectData.code !== undefined) {
      fields.push(`code = $${idx}`);
      values.push(defectData.code.toUpperCase());
      idx++;
    }
    if (defectData.description !== undefined) {
      fields.push(`description = $${idx}`);
      values.push(defectData.description);
      idx++;
    }
    if (defectData.category !== undefined) {
      fields.push(`category = $${idx}`);
      values.push(defectData.category);
      idx++;
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE defects SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteDefect(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM defects WHERE id = $1 RETURNING id", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async getDefectsByCategory(category: string): Promise<Defect[]> {
    const result = await pool.query(
      "SELECT * FROM defects WHERE LOWER(category) = LOWER($1) ORDER BY code",
      [category]
    );
    return result.rows;
  }

  async getDefectUsageCount(defectId: number): Promise<number> {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM order_defects WHERE defect_id = $1",
      [defectId]
    );
    return parseInt(result.rows[0]?.count || "0");
  }
}