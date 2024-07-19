import pool from '../../../server/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM robots WHERE robot_id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Robot bulunamadı' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).json({ success: false, error: 'Veritabanı hatası' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}

/**
 * @swagger
 * /api/robots/{id}:
 *   get:
 *     tags:
 *       - robot
 *     summary: Retrieve a robot by ID
 *     description: Returns a robot's details by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the robot to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the robot's details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 robot_id:
 *                   type: integer
 *                   description: The robot ID.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the robot.
 *                   example: "Robot1"
 *                 status:
 *                   type: string
 *                   description: The status of the robot.
 *                   example: "active"
 *       404:
 *         description: Robot not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Robot bulunamadı"
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
 *                 error:
 *                   type: string
 *                   example: "Veritabanı hatası"
 */