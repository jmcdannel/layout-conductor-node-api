import server from './core/server.mjs';
import interfaces from './core/interfaces.mjs';
import log from './core/logger.mjs'

try {
  server.connect();
  interfaces.connect();
} catch (err) {
  log.fatal('main', err);
}
