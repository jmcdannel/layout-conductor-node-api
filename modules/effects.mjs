
import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import interfaces from '../communication/interfaces.mjs';
import log from '../core/logger.mjs';

const EFFECTS = 'effects';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const save = effects => {
  const modPath = path.resolve(__dirname, modulePath(EFFECTS));
  writeFile(modPath, JSON.stringify(effects), function(err) {
    if (err) throw err;
    log.success('save effects complete');
  });
}

const run = (action, state) => {
  const com = interfaces.interfaces[action['interface']];
  log.debug('action', action);

  if (action.interface === 'betatrack-layout') {
    com.send(com.connection, action, state);
  }

}

export const get = () => {
  log.debug('effects.get');
  return module(EFFECTS);
}

export const put = ({ Id, data }) => {
  const effects = get();
  const effect = effects.find(e => e.effectId === Id );
  if (effect) {
    effect.state = data.state;
    effect.actions.map(action => run(action, data.state));
    save(effects);
  }
  return effects;
}

export const process = payload => {
  return payload?.Id && payload?.data ? put(payload) : get();
}

export default {
  get,
  process,
  put
};
