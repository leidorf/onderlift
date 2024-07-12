import pool from "../../server/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { robot_id, x_coordinate, y_coordinate, z_coordinate } = req.body;

    if (
      !robot_id ||
      typeof x_coordinate !== "number" ||
      typeof y_coordinate !== "number" ||
      typeof z_coordinate !== "number"
    ) {
      return res.status(400).json({ success: false, message: "Eksik bilgi" });
    }

    try {
      const query =
        "INSERT INTO waypoints (robot_id, x_coordinate, y_coordinate, z_coordinate) VALUES (?, ?, ?, ?)";
      const [] = await pool.query(query, [
        robot_id,
        x_coordinate,
        y_coordinate,
        z_coordinate,
      ]);

      res.status(200).json({ success: true, message: "Yol başarıyla eklendi" });
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ success: false, message: "Veritabanı hatası" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
