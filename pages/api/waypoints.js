import pool from '../../server/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { robot_id } = req.query;

    if (!robot_id) {
      return res.status(400).json({ success: false, message: 'Robot ID belirtilmeli' });
    }

    try {
      const query = 'SELECT * FROM waypoints WHERE robot_id = ?';
      const [waypoints] = await pool.query(query, [robot_id]);
      res.status(200).json(waypoints);
    } catch (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).json({ success: false, message: 'Veritabanı hatası' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

/**
 * @swagger
 * /api/waypoints:
 *   get:
 *     tags:
 *       - waypoint
 *     summary: Retrieves all waypoints
 *     description: Retrieves all waypoints associated with a specific robot based on its ID.
 *     parameters:
 *       - name: robot_id
 *         in: query
 *         description: The ID of the robot for which waypoints are to be retrieved.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of waypoints associated with the specified robot.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   waypoint_id:
 *                     type: integer
 *                     description: Unique identifier of the waypoint.
 *                   robot_id:
 *                     type: integer
 *                     description: ID of the robot associated with the waypoint.
 *                   x_coordinate:
 *                     type: number
 *                     format: float
 *                     description: X coordinate of the waypoint.
 *                   y_coordinate:
 *                     type: number
 *                     format: float
 *                     description: Y coordinate of the waypoint.
 *                   z_coordinate:
 *                     type: number
 *                     format: float
 *                     description: Z coordinate of the waypoint.
 *       400:
 *         description: Robot ID is required to retrieve the waypoints.
 *       500:
 *         description: Database error occurred while retrieving the waypoints.
 *       405:
 *         description: Method not allowed.
 */
