import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import interfaces from '../communication/interfaces.mjs';
import log from '../core/logger.mjs';

const TURNOUTS = 'turnouts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const save = turnouts => {
  const modPath = path.resolve(__dirname, modulePath(TURNOUTS));
  writeFile(modPath, JSON.stringify(turnouts), function(err) {
    if (err) throw err;
    log.log('[TURNOUTS] save complete');
  });
}

const run = (turnout, state) => {
  const { interface: iFaceId } = turnout.config;
  const com = interfaces.interfaces[iFaceId];
  log.debug('[TURNOUTS] run', turnout.name, turnout.config.turnoutIdx, state);
  interfaces.handleCommands(turnout, 'turnout');
}

export const get = () => {
  return module(TURNOUTS);
}

export const put = ({ Id, data }) => {
  const turnouts = get();
  const turnout = turnouts.find(e => e.turnoutId === Id );
  if (turnout) {
    turnout.state = data.state;
    run(turnout, data.state)
    save(turnouts);
  }
  return turnouts;
}

export const process = payload => {
  return payload?.Id && payload?.data ? put(payload) : get();
}

export default {
  get,
  process,
  put
};
