import pool from "@/server/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { robot_id, waypoint_ids } = req.body;

    if (!robot_id || !Array.isArray(waypoint_ids)) {
      return res.status(400).json({ error: "Eksik veya geçersiz alanlar" });
    }

    try {
      const waypointIdsStr = waypoint_ids.join(",");

      const [result] = await pool.query("INSERT INTO tasks (robot_id, waypoint_ids) VALUES (?, ?)", [robot_id, waypointIdsStr]);

      res.status(200).json({ success: true, task_id: result.insertId });
    } catch (error) {
      console.error("Veritabanına kaydedilirken bir hata oluştu:", error);
      res.status(500).json({ error: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  } else {
    res.status(405).json({ error: "Yalnızca POST isteği desteklenmektedir" });
  }
}
