import pool from "../../server/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM robots');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch robot" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

/**
 * @swagger
 * /api/robots:
 *   get:
 *     tags:
 *       - robot
 *     summary: Retrieve a list of all robots
 *     description: Retrieves a list of all robots from the database.
 *     responses:
 *       200:
 *         description: A list of robots successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   robot_id:
 *                     type: integer
 *                     description: Unique identifier of the robot.
 *                   ip_address:
 *                     type: string
 *                     description: IP address of the robot.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the robot was created.
 *       500:
 *         description: Failed to fetch robots.
 *       405:
 *         description: Method not allowed.
 */