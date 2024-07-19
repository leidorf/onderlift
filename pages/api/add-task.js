import pool from "@/server/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { robot_id, waypoint_ids } = req.body;

    if (!robot_id || !Array.isArray(waypoint_ids)) {
      return res.status(400).json({ error: "Eksik veya geçersiz alanlar" });
    }

    try {
      const waypointIdsStr = waypoint_ids.join(",");

      const [result] = await pool.query("INSERT INTO tasks (robot_id, waypoint_ids) VALUES (?, ?)", [robot_id, waypointIdsStr]);

      res.status(200).json({ success: true, task_id: result.insertId });
    } catch (error) {
      console.error("Veritabanına kaydedilirken bir hata oluştu:", error);
      res.status(500).json({ error: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  } else {
    res.status(405).json({ error: "Yalnızca POST isteği desteklenmektedir" });
  }
}

/**
 * @swagger
 * /api/add-task:
 *   post:
 *     tags:
 *       - task
 *     summary: Create a new task for a robot
 *     description: Adds a new task to the database with the provided robot ID and waypoint IDs.
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
 *               waypoint_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: An array of waypoint IDs.
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Successfully created the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 task_id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Eksik veya geçersiz alanlar"
 *       500:
 *         description: Database error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Veritabanına kaydedilirken bir hata oluştu"
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Yalnızca POST isteği desteklenmektedir"
 */