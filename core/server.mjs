import { WebSocketServer } from 'ws';
import { reduce } from './reducer.mjs';
import log from './logger.mjs'

const port = 8080;
const serverId = 'TamarackJunctionWebsocketServer';

const sendMessage = (msg, ws) => {
  ws.send(JSON.stringify({
    action: 'message',
    payload: msg
  }));
}

const receiveMessage = (data, ws) =>{
  const msg = JSON.parse(data);
  log.info('received: %s', msg.action);
  log.debug('payload: %s', msg.payload);
  const res = reduce(msg);
  if (res) {
    ws.send(JSON.stringify({
      action: msg.action,
      payload: res
    }));
  }
}

const handleClose = () => {
  log.info("the client has connected");
}

const handleError = () => {
  log.error("Some Error occurred");
}

const handleConnection = ws => {
  log.success("new client connected", ws);

  // sending message to client
  sendMessage(`${serverId} is connected`, ws);

  // handling what to do when clients disconnects from server
  ws.on("close", handleClose);
  
  // handling client connection error
  ws.onerror = handleError;

  ws.on('message', function message(data) {
    receiveMessage(data, ws);
  });
}

const connect = () => {
  const wss = new WebSocketServer({ port });
  wss.on('connection', handleConnection);
  log.start("The WebSocket server is running on port 8080");
}


export default { connect };