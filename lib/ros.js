import ROSLIB from "roslib";

const ros = new ROSLIB.Ros({
  url: "ws://192.168.18.134:9090",
});

ros.on("connection", () => {});

ros.on("error", (error) => {
  error;
});

ros.on("close", () => {});

export default ros;
