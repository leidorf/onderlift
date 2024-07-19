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

/**
 * @swagger
 * /api/add-waypoint:
 *   post:
 *     tags:
 *       - waypoint
 *     summary: Create a new waypoint for a robot
 *     description: Adds a new waypoint to the database with the provided robot ID and coordinates.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               robot_id:
 *                 type: integer
 *                 description: The ID of the robot.
 *                 example: 1
 *               x_coordinate:
 *                 type: number
 *                 description: The X coordinate of the waypoint.
 *                 example: 12.34
 *               y_coordinate:
 *                 type: number
 *                 description: The Y coordinate of the waypoint.
 *                 example: 56.78
 *               z_coordinate:
 *                 type: number
 *                 description: The Z coordinate of the waypoint.
 *                 example: 90.12
 *     responses:
 *       200:
 *         description: Successfully created the waypoint.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Yol başarıyla eklendi"
 *       400:
 *         description: Missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Eksik bilgi"
 *       500:
 *         description: Database error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Veritabanı hatası"
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Method POST not allowed"
 */
