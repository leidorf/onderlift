import ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
  url: 'ws://172.20.10.2:9090'
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

ros.customConnect = function() {
  return new Promise((resolve, reject) => {
    this.once('connection', resolve);
    this.once('error', reject);
    this.connect(this.url);
  });
};

export default ros;

