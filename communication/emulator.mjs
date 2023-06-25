import log from '../core/logger.mjs';

const connect = com => ({
  write: (data, onError) => {
    try {
      log.watch('[EMULATOR]', data, com);
    } catch (err) {
      onError(err);
    }
  }
});

const send = (port, { pin }, state) => {
  const payload = { pin, state };
  port.write(`${JSON.stringify(payload)}\n`, err => {
    if (err) {
      return log.error('[EMULATOR] Error on write: ', err.message);
    }
  });
};

export default {
  connect,
  send
}