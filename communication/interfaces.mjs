import { get as getLayoutConfig }  from '../modules/layout.mjs';
import serial from './serial.mjs';
import emulator from './emulator.mjs';
import commands from './commands.mjs';
import { getPorts } from '../scripts/listPorts.mjs';
import log from '../core/logger.mjs';

const config = getLayoutConfig();
const interfaces = {};

const identifySerialConnections = async () => {
  const serialPorts = await getPorts();
  return serialPorts;
}

const handleCommands = (module, commandType) => {
  commands.send(commands.build(module, commandType));
}

const intialize = com => {
  log.info('[INTERFACES] intializing', com?.type, com?.id);
  switch(com.type) {
    case 'emulate':
      com.connection = emulator.connect();
      com.send = emulator.send;
      break;
    case 'serial':
      com.connection = serial.connect(com);
      com.send = serial.send;
      break;
    case 'default':
      log.warn('[INTERFACES] Interface type not found', com.type);
      break;
  }
  interfaces[com.id] = com;
}

const connect = async () => {
  log.start('Connecting Interfaces');
  await identifySerialConnections();
  config.interfaces.map(intialize);
}

export default { connect, interfaces, handleCommands };
