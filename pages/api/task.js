import pool from "@/server/db";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Cok fazla istek gonderildi, lutfen bir sure sonra tekrar deneyiniz.",
});

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
  
  // add-task API
  if (req.method === "POST") {
    const { robot_id, waypoint_ids } = req.body;

    if (!robot_id || !Array.isArray(waypoint_ids)) {
      return res.status(400).json({ error: "Eksik veya geçersiz alanlar" });
    }

    try {
      const waypointIdsStr = JSON.stringify(waypoint_ids);

      const [result] = await pool.query("INSERT INTO tasks (robot_id, waypoint_ids) VALUES (?, ?)", [robot_id, waypointIdsStr]);

      res.status(200).json({ success: true, task_id: result.insertId });
    } catch (error) {
      console.error("Veritabanına kaydedilirken bir hata oluştu:", error);
      res.status(500).json({ error: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
  
  // delete-task API
  else if(req.method==="DELETE"){
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
  
  // task info API
  else if (req.method === "GET") {
    const { task_id } = req.query;

    if (!task_id) {
      return res.status(400).json({ success: false, error: "Görev ID belirtilmeli" });
    }

    try {
      const [rows] = await pool.query("SELECT * FROM tasks WHERE task_id = ?", [task_id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Görev bulunamadı" });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ success: false, error: "Veritabanı hatası" });
    }
  }
  
  else {
    res.setHeader("Allow", ["POST", "DELETE", "GET"]);
    res.status(405).json({ error: "Yalnızca POST, DELETE ve GET isteği desteklenmektedir" });
  }
}