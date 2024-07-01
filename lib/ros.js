import ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
  url: 'ws://192.168.40.13:9090'
});

ros.on('connection', () => {
  console.log('Connected to websocket server.');
});

ros.on('error', (error) => {
  console.log('Error connecting to websocket server:', error);
});

ros.on('close', () => {
  console.log('Connection to websocket server closed.');
});

export default ros;
