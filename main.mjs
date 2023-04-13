import { WebSocketServer } from 'ws';
import { reduce } from './reducer.mjs';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log("new client connected");

  // sending message to client
  ws.send('Welcome, you are connected!');
 
  // handling what to do when clients disconnects from server
  ws.on("close", () => {
    console.info("the client has connected");
  });
  // handling client connection error
  ws.onerror = function () {
    console.error("Some Error occurred")
  }
  ws.on('message', function message(data) {
    const msg = JSON.parse(data);
    console.log('received: %s', msg.action);
    console.log('payload: %s', JSON.stringify(msg.payload, null, 2));
    const res = reduce(msg);
    if (res) {
      ws.send(JSON.stringify({
        action: msg.action,
        payload: res
      }));
    }
  });

  ws.send('something');
});
console.log("The WebSocket server is running on port 8080");


