import pool from "../../server/db";

export default async function handler(req, res) {
  const { robot_id } = req.query;

  if (!robot_id) {
    return res.status(400).json({ success: false, error: "Robot ID belirtilmeli" });
  }

  try {
    await pool.query("DELETE FROM waypoints WHERE robot_id = ?", [id]);

    await pool.query("DELETE FROM robots WHERE robot_id = ?", [id]);

    res.status(200).json({ success: true, message: "Robot başarıyla silindi" });
  } catch (error) {
    console.error("Veritabanı hatası:", error);
    res.status(500).json({ success: false, error: "Veritabanı hatası" });
  }
}

/**
 * @swagger
 * /api/delete-robot:
 *   delete:
 *     tags:
 *       - robot
 *     summary: Delete the robot
 *     description: Deletes a robot and its associated waypoints from the database.
 *     parameters:
 *       - name: robot_id
 *         in: query
 *         required: true
 *         description: The ID of the robot to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Robot successfully deleted.
 *       400:
 *         description: Robot ID is required.
 *       500:
 *         description: Database error occurred.
 */
