const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// read index into memory
const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass int he http server to socketio and grab the websocker server as io
const io = socketio(app);

let squares = {};

const makeSquare = (xVal, yVal, time) => {
  console.log(`Making new Square at ${xVal},${yVal}`);

  squares[time] = {};

  squares[time].x = xVal;
  squares[time].y = yVal;
};

const listeners = (sock) => {
  const socket = sock;

  socket.on('newSquare', (data) => {
    makeSquare(data.x, data.y, data.time);
  });
};

io.sockets.on('connection', (socket) => {
  console.log('someone joined');

  listeners(socket);
  setInterval(() => {
    socket.emit('giveSquares', { squares });
  }, 100);

  setInterval(() => {
    squares = {};
  }, 30000);
});

console.log('Websocket server started');
