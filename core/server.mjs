import { WebSocketServer } from 'ws';
import { reduce } from './reducer.mjs';
import log from './logger.mjs'

const port = 8080; // TODO: move to config
const serverId = 'TamarackJunctionWebsocketServer'; // TODO: move to config

const MSG_CONNECTED = JSON.stringify({
  action: 'message',
  payload: `${serverId} is connected`
})

const receiveMessage = (data, ws) => {
  const msg = JSON.parse(data);
  const { action } = msg;
  const payload = reduce(msg);
  const command = JSON.stringify({ action, payload });
  payload && ws.send(command);
}

const handleClose = () => {
  log.info('[SERVER] connection closed');
}

const handleError = err => {
  log.error('[SERVER] Unexpected error occurred', err);
}

const handleConnection = ws => {
  // handling client connection error
  ws.onerror = handleError;

  log.success('[SERVER] new client connected');

  // handling what to do when clients disconnects from server
  ws.on('close', handleClose);

  // handling what to do when messageis recieved
  ws.on('message', (data) => receiveMessage(data, ws));

  // sending message to client
  ws.send(MSG_CONNECTED);
}

const connect = () => {
  const wss = new WebSocketServer({ port });
  wss.on('connection', handleConnection);
  log.start('[SERVER] The WebSocket server is running on port 8080');
}

export default { connect };
