import pool from "../../server/db";

export default async function handler(req, res) {
  const { task_id } = req.query;

  if (!task_id) {
    return res.status(400).json({ success: false, error: "Görev ID belirtilmeli" });
  }

  try {
    await pool.query("DELETE FROM tasks WHERE task_id = ?", [task_id]);

    res.status(200).json({ success: true, message: "Görev başarıyla silindi" });
  } catch (error) {
    console.error("Veritabanı hatası:", error);
    res.status(500).json({ success: false, error: "Veritabanı hatası" });
  }
}
