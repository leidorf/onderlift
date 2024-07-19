import pool from '../../server/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { robot_id } = req.query;

    if (!robot_id) {
      return res.status(400).json({ success: false, message: 'Robot ID belirtilmeli' });
    }

    try {
      const query = 'SELECT * FROM tasks WHERE robot_id = ?';
      const [tasks] = await pool.query(query, [robot_id]);
      res.status(200).json(tasks);
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
 * /api/tasks:
 *   get:
 *     tags:
 *       - task
 *     summary: Retrieve a list of tasks
 *     description: Retrieves a list of tasks for a specific robot from the database.
 *     parameters:
 *       - name: robot_id
 *         in: query
 *         description: The ID of the robot for which tasks are to be retrieved.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of tasks successfully retrieved for the specified robot.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task_id:
 *                     type: integer
 *                     description: Unique identifier of the task.
 *                   robot_id:
 *                     type: integer
 *                     description: ID of the robot to which the task belongs.
 *                   waypoint_ids:
 *                     type: string
 *                     description: Comma-separated list of waypoint IDs associated with the task.
 *       400:
 *         description: Robot ID is required to retrieve tasks.
 *       500:
 *         description: Database error occurred while retrieving tasks.
 *       405:
 *         description: Method not allowed.
 */
