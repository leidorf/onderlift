/* import pool from "@/server/db";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { task_id } = req.query;

  try {
    const [taskRows] = await pool.execute('SELECT waypoint_ids FROM tasks WHERE task_id = ?', [task_id]);
    if (taskRows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const waypoint_ids = taskRows[0].waypoint_ids.split(',');
    const [waypointRows] = await pool.query('SELECT * FROM waypoints WHERE waypoint_id IN (?)', [waypoint_ids]);

    res.status(200).json(waypointRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
 */