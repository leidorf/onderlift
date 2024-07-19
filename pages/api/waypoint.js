import pool from "../../server/db";

export default async function handler(req, res) {
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
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

/**
 * @swagger
 * /api/waypoint:
 *   get:
 *     tags:
 *       - waypoint
 *     summary: Retrieves information about the waypoint
 *     description: Retrieves a specific waypoint from the database based on its ID.
 *     parameters:
 *       - name: waypoint_id
 *         in: query
 *         description: The ID of the waypoint to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The waypoint successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 waypoint_id:
 *                   type: integer
 *                   description: Unique identifier of the waypoint.
 *                 robot_id:
 *                   type: integer
 *                   description: ID of the robot associated with the waypoint.
 *                 x_coordinate:
 *                   type: number
 *                   format: float
 *                   description: X coordinate of the waypoint.
 *                 y_coordinate:
 *                   type: number
 *                   format: float
 *                   description: Y coordinate of the waypoint.
 *                 z_coordinate:
 *                   type: number
 *                   format: float
 *                   description: Z coordinate of the waypoint.
 *       400:
 *         description: Waypoint ID is required to retrieve the waypoint.
 *       500:
 *         description: Database error occurred while retrieving the waypoint.
 *       405:
 *         description: Method not allowed.
 */