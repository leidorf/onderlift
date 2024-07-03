import ROSLIB from "roslib";
import ros from "./ros";
const mapTopic = new ROSLIB.Topic({
  ros: ros,
  name: "/map",
  messageType: "nav_msgs/OccupancyGrid",
});
export { mapTopic };
