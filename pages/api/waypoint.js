import pool from "../../server/db";

export default async function handler(req, res) {
  // /api/waypoint get-waypoint API
  if (req.method === "GET") {
    const { waypoint_id } = req.query;

    if (!waypoint_id) {
      return res.status(400).json({ success: false, message: "Waypoint ID belirtilmeli" });
    }

    try {
      const query = "SELECT * FROM waypoints WHERE waypoint_id = ?";
      const [waypoint] = await pool.query(query, [waypoint_id]);
      res.status(200).json(waypoint);
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ success: false, message: "Veritabanı hatası" });
    }
  } 
    // /api/waypoint delete-waypoint API
  else if (req.method === "DELETE") {
    const { waypoint_id } = req.query;

    if (!waypoint_id) {
      return res.status(400).json({ success: false, error: "Düğüm ID belirtilmeli" });
    }

    try {
      const [tasks] = await pool.query(
        `
      SELECT * FROM tasks WHERE FIND_IN_SET(?, waypoint_ids)
    `,
        [waypoint_id]
      );

      if (tasks.length > 0) {
        const task_id = tasks[0].task_id;

        await pool.query(
          `
        DELETE FROM tasks WHERE task_id = ?
      `,
          [task_id]
        );
      }

      await pool.query("DELETE FROM waypoints WHERE waypoint_id = ?", [waypoint_id]);

      res.status(200).json({ success: true, message: "Düğüm ve ilişkili görev başarıyla silindi" });
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ success: false, error: "Veritabanı hatası" });
    }
  } 
  // /api/waypoint add-waypoint API
  else if (req.method === "POST") {
    const { robot_id, x_coordinate, y_coordinate, z_coordinate } = req.body;

    if (!robot_id || typeof x_coordinate !== "number" || typeof y_coordinate !== "number" || typeof z_coordinate !== "number") {
      return res.status(400).json({ success: false, message: "Eksik bilgi" });
    }

    try {
      const query = "INSERT INTO waypoints (robot_id, x_coordinate, y_coordinate, z_coordinate) VALUES (?, ?, ?, ?)";
      const result = await pool.query(query, [robot_id, x_coordinate, y_coordinate, z_coordinate]);

      res.status(200).json({ success: true, message: "Yol başarıyla eklendi" });
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ success: false, message: "Veritabanı hatası" });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE", "POST"]);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}