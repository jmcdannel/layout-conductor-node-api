import { SerialPort } from 'serialport';
import log from '../core/logger.mjs';

export const getPorts = async () => {
  try {
    const ports = await SerialPort.list();
    return ports.map(port => port.path);
  } catch (err) {
    log.fatal(err);
  }
}

const main = async () => {
  const serialPortPaths = await getPorts();
  serialPortPaths.map(path => log.info(path));
}

main();

export default getPorts;
