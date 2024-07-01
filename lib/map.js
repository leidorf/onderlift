import ROSLIB from "roslib";
import ros from "./ros";

const mapTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/map', // Harita mesajlarının yayınlandığı ROS topic adı
  messageType: 'nav_msgs/OccupancyGrid',
});

export const getMapData = (callback) => {
  mapTopic.subscribe((message) => {
    callback(message);
  });
};

export const unsubscribeMap = () => {
  mapTopic.unsubscribe();
};
