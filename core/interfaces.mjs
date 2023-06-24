import { get as getLayoutConfig }  from '../modules/layout.mjs';
import serial from './serial.mjs';
import { getPorts } from '../scripts/listPorts.mjs';
import log from './logger.mjs';

const config = getLayoutConfig();
const interfaces = {};

const intialize = com => {
  switch(com.type) {
    case 'serial':
      com.connection = serial.connect(com);
      com.send = serial.send;
      break;
    case 'default':
      log.warn('Interface type not found', com.type);
      break;
  }
  interfaces[com.id] = com;
}

const identifySerialConnections = async () => {
  const serialPorts = await getPorts();
  log.info('identifySerialConnections', serialPorts);
}

const connect = async () => {
  log.start('Connecting Interfaces');
  await identifySerialConnections();
  config.interfaces.map(intialize);
}

export default { connect, interfaces };
