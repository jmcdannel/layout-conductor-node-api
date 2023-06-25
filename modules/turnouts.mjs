import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import interfaces from '../core/interfaces.mjs';
import effects from '../modules/effects.mjs';
import log from '../core/logger.mjs';

const TURNOUTS = 'turnouts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const save = turnouts => {
  const modPath = path.resolve(__dirname, modulePath(TURNOUTS));
  writeFile(modPath, JSON.stringify(turnouts), function(err) {
    if (err) throw err;
    log.log('turnouts.save complete');
  });
}

const run = (turnout, state) => {
  const { interface: iFaceId } = turnout.config;
  const com = interfaces.interfaces[iFaceId];
  log.debug('turnout', turnout.name, turnout.config.turnoutIdx, state);

  if (com.type === 'serial') {
    com.send(com.connection, [{ 
      action: 'turnout', 
      payload: { turnout: turnout.config.turnoutIdx, state }
    }]);
  }

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
