import pool from "@/server/db";
import ROSLIB from "roslib";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Çok fazla istek gönderildi, lütfen bir süre sonra tekrar deneyiniz.",
});

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { task_id, rosUrl } = req.body;

  try {
    // Create a new ROS connection dynamically based on the received URL
    const ros = new ROSLIB.Ros({
      url: rosUrl,
    });

    ros.on("connection", () => {
      console.log("Connected to ROS.");
    });

    ros.on("error", (error) => {
      console.error("Error connecting to ROS:", error);
      res.status(500).json({ error: "Failed to connect to ROS" });
    });

    ros.on("close", () => {
      console.log("Connection to ROS closed.");
    });

    const [taskRows] = await pool.execute("SELECT waypoint_ids FROM tasks WHERE task_id = ?", [task_id]);
    if (taskRows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const waypoint_ids = taskRows[0].waypoint_ids.split(",");
    const [waypointRows] = await pool.query("SELECT * FROM waypoints WHERE waypoint_id IN (?)", [waypoint_ids]);

    const goalTopic = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base_simple/goal",
      messageType: "geometry_msgs/PoseStamped",
    });

    for (const waypoint of waypointRows) {
      const goalMessage = new ROSLIB.Message({
        header: {
          frame_id: "map",
          stamp: {
            secs: 0,
            nsecs: 0,
          },
        },
        pose: {
          position: {
            x: parseFloat(waypoint.x_coordinate),
            y: parseFloat(waypoint.y_coordinate),
            z: parseFloat(waypoint.z_coordinate),
          },
          orientation: {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            w: 1.0,
          },
        },
      });

      goalTopic.publish(goalMessage);
    }

    res.status(200).json({ message: "Task sent to ROS successfully" });
  } catch (error) {
    console.error("Error sending task to ROS:", error);
    res.status(500).json({ error: "Failed to send task to ROS" });
  }
}
