/* import ROSLIB from 'roslib';
import ros from './ros';
import getTaskDetails from "@/pages/api/get-task-details";

// ROS'a görev gönderme
export async function sendTaskToROS(task_id) {
  try {
    const waypoints = await getTaskDetails(task_id);

    const goalTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/move_base_simple/goal',
      messageType: 'geometry_msgs/PoseStamped'
    });

    for (const waypoint of waypoints) {
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
  } catch (error) {
    console.error('Error sending task to ROS:', error);
  }
}

document.getElementById('sendTaskButton').addEventListener('click', () => {
  const task_id = document.getElementById('taskIdInput').value;
  sendTaskToROS(task_id);
});
 */