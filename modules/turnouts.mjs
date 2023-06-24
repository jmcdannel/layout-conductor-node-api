import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import log from '../core/logger.mjs';

const TURNOUTS = 'turnouts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const save = turnouts => {
  const modPath = path.resolve(__dirname, modulePath(TURNOUTS));
  writeFile(modPath, JSON.stringify(turnouts), function(err) {
    if (err) throw err;
    log.success('save turnouts complete');
  });
}

export const get = () => {
  log.debug('turnouts.get');
  return module(TURNOUTS);
}

export const put = ({ Id, data}) => {
  const turnouts = get();
  const turnout = turnouts.find(e => e.turnoutId === Id );
  if (turnout) {
    turnout = {...turnout, ...data};
    // turnout.state = data.state;
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
