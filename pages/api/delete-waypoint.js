import pool from '../../server/db';

export default async function handler(req, res) {
  const { waypoint_id } = req.query;

  if (!waypoint_id) {
    return res.status(400).json({ success: false, error: 'Düğüm ID belirtilmeli' });
  }

  try {
    // Find tasks containing the waypoint
    const [tasks] = await pool.query(`
      SELECT * FROM tasks WHERE FIND_IN_SET(?, waypoint_ids)
    `, [waypoint_id]);

    if (tasks.length > 0) {
      const task_id = tasks[0].task_id;

      // Delete the task
      await pool.query(`
        DELETE FROM tasks WHERE task_id = ?
      `, [task_id]);
    }

    // Delete the waypoint
    await pool.query('DELETE FROM waypoints WHERE waypoint_id = ?', [waypoint_id]);

    res.status(200).json({ success: true, message: 'Düğüm ve ilişkili görev başarıyla silindi' });
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
}

/**
 * @swagger
 * /api/delete-waypoint:
 *   delete:
 *     tags:
 *       - waypoint
 *     summary: Delete the waypoint 
 *     description: Deletes a waypoint from the database using the waypoint ID. If the waypoint is associated with any tasks, the related tasks are also deleted.
 *     parameters:
 *       - name: waypoint_id
 *         in: query
 *         required: true
 *         description: The ID of the waypoint to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Waypoint and associated tasks successfully deleted.
 *       400:
 *         description: Waypoint ID is required.
 *       500:
 *         description: Database error occurred.
 */