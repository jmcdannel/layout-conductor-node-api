import { SerialPort } from 'serialport';
import log from '../core/logger.mjs';

const connect = com => {

  const path = com.serial;
  const baudRate = com.baud;

  // Create a port
  const port = new SerialPort({
    path,
    baudRate,
    autoOpen: false,
  });

  port.open(function (err) {
    if (err) {
      return log.error('Error opening port: ', err.message);
    }

    // Because there's no callback to write, write errors will be emitted on the port:
    port.write('main screen turn on\n');
  });

  // The open event is always emitted
  port.on('open', function() {
    // open logic
    log.start('Serial port open', path, baudRate);
  });

  // Read data that is available but keep the stream in "paused mode"
  // port.on('readable', function () {
  //   log.log('Data:', port.read());
  // });

  // Switches the port into "flowing mode"
  // port.on('data', function (data) {
  //   log.log('Data:', data);
  // });
  
  return port;
}

const send = (port, { pin }, state) => {
  const payload = { pin, state };
  port.write(`${JSON.stringify(payload)}\n`, err => {
    if (err) {
      return log.error('Error on write: ', err.message);
    }
    log.log('payload written', payload);
  });
};

export default {
  connect,
  send
}