// import { get as getLayoutConfig }  from '../modules/layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import serial from './serial.mjs';
import cmdex from './cmdex.mjs';
import emulator from './emulator.mjs';
import audioplayer from './audioplayer.mjs';
import commands from './commands.mjs';
import { getPorts } from '../scripts/listPorts.mjs';
import log from '../core/logger.mjs';

const config = {
  "layoutId": "betatrack",
  "name": "Beta Track Junction",
  "modules": [
    "turnouts",
    "routes",
    "locos",
    "effects"
  ],
  "devices": [
    {
      "type": "arduino",
      "id": "cmd",
      "desc": "Command Station EX"
    },
    {
      "type": "arduino",
      "id": "betatrack-serial",
      "desc": "Arduino Direct Serial Control"
    },
    {
      "type": "macOS",
      "id": "MacMini",
      "desc": "MacMini w/JMRI",
      "connectedDevices": [
        "cmd",
        "betatrack-serial"
      ]
    }
  ],
  "interfaces": [
    {
      "id": "cmd-serial",
      "type": "cmd-ex",
      "device": "cmd",
      "serial": "/dev/tty.usbmodem2401",
      "baud": 115200,
      "status": "fail"
    },
    {
      "id": "betatrack-layout",
      "type": "serial",
      "device": "betatrack-serial",
      "serial": "/dev/tty.usbserial-230",
      "baud": 115200,
      "status": "fail"
    },
    {
      "id": "audio",
      "type": "audio",
      "device": "MacMini",
      "connection": {}
    }
  ],
  "apiHost": "localhost",
  "jmri": "http://localhost:12080/json/"
}

const interfaces = {};

const identifySerialConnections = async () => {
  const serialPorts = await getPorts();
  return serialPorts;
}

export const handleCommands = async (msg, ws) => {
  console.log('handleCommands', msg);
  const commandList = await commands.build(msg);
  log.info('[INTERFACES] commandList', commandList);
  await commands.send(commandList);
  ws.send(JSON.stringify({ success: true, payload: msg }));
}

const intialize = async (com) => {
  log.info('[INTERFACES] intializing', com?.type, com?.id);
  switch(com.type) {
    case 'emulate':
      com.connection = emulator.connect();
      com.send = emulator.send;
      break;
    case 'serial':
      try {
        com.connection = await serial.connect(com);
        com.send = serial.send;
        com.status = 'connected';
      } catch (err) {
        com.status = 'fail';
        log.error(err);
      }
      break;
    case 'cmd-ex':
      try {
        com.connection = await cmdex.connect(com);
        com.send = cmdex.send;
        com.status = 'connected';
      } catch (err) {
        com.status = 'fail';
        log.error(err);
      }
      break;
    case 'audio':
      com.connection = audioplayer.connect(com);
      com.send = audioplayer.send;
      break;
    case 'default':
      log.warn('[INTERFACES] Interface type not found', com.type);
      break;
  }
  interfaces[com.id] = com;
}

export const connect = async () => {
  log.start('Connecting Interfaces');
  await identifySerialConnections();
  config.interfaces.map(await intialize);
}

export default { connect, interfaces, handleCommands };
