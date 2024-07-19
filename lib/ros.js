import ROSLIB from "roslib";

const ros = new ROSLIB.Ros({
  url: "ws://172.20.10.2:9090",
});

ros.on("connection", () => {});

ros.on("error", (error) => {
  error;
});

ros.on("close", () => {});

export default ros;
