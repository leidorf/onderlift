import pool from "../../server/db";

export default async function handler(req, res) {
  const { task_id } = req.query;

  if (!task_id) {
    return res.status(400).json({ success: false, error: "Görev ID belirtilmeli" });
  }

  try {
    await pool.query("DELETE FROM tasks WHERE task_id = ?", [task_id]);

    res.status(200).json({ success: true, message: "Görev başarıyla silindi" });
  } catch (error) {
    console.error("Veritabanı hatası:", error);
    res.status(500).json({ success: false, error: "Veritabanı hatası" });
  }
}

/**
 * @swagger
 * /api/delete-task:
 *   delete:
 *     tags:
 *       - task
 *     summary: Delete a task from the robot
 *     description: Deletes a task from the database using the task ID.
 *     parameters:
 *       - name: task_id
 *         in: query
 *         required: true
 *         description: The ID of the task to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task successfully deleted.
 *       400:
 *         description: Task ID is required.
 *       500:
 *         description: Database error occurred.
 */