import pool from '@/server/db';
import ros from '@/lib/ros'; 
import ROSLIB from 'roslib'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); 
  }

  const { task_id } = req.body;

  try {
    const [taskRows] = await pool.execute('SELECT waypoint_ids FROM tasks WHERE task_id = ?', [task_id]);
    if (taskRows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const waypoint_ids = taskRows[0].waypoint_ids.split(',');
    const [waypointRows] = await pool.query('SELECT * FROM waypoints WHERE waypoint_id IN (?)', [waypoint_ids]);

    const goalTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/move_base_simple/goal',
      messageType: 'geometry_msgs/PoseStamped'
    });

    for (const waypoint of waypointRows) {
      const goalMessage = new ROSLIB.Message({
        header: {
          frame_id: 'map',
          stamp: {
            secs: 0,
            nsecs: 0
          }
        },
        pose: {
          position: {
            x: parseFloat(waypoint.x_coordinate),
            y: parseFloat(waypoint.y_coordinate),
            z: parseFloat(waypoint.z_coordinate)
          },
          orientation: {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            w: 1.0
          }
        }
      });

      goalTopic.publish(goalMessage);
    }

    res.status(200).json({ message: 'Task sent to ROS successfully' });
  } catch (error) {
    console.error('Error sending task to ROS:', error);
    res.status(500).json({ error: 'Failed to send task to ROS' });
  }
}

/**
 * @swagger
 * /api/assign-task:
 *   post:
 *     tags:
 *       - task
 *     summary: Send task to ROS
 *     description: Sends the task with the specified ID to ROS by publishing waypoints to a ROS topic.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task_id:
 *                 type: integer
 *                 description: The ID of the task to be sent to ROS.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Task sent to ROS successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Task sent to ROS successfully'
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Task not found'
 *       500:
 *         description: Failed to send task to ROS.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Failed to send task to ROS'
 */
