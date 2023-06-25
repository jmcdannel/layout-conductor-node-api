
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

const run = ({ type: effectType, actions, state}) => {
  actions.reduce((list, action) => {
    log.debug('run action', action, effectType);
    const { interface: iFaceId } = action; 
    let listIem = list.find(l => l.iFaceId === iFaceId);
    if (!listIem) {
      listIem = { iFaceId, commands: [] };
      list.push(listIem);
    }

    switch(effectType) {
      case 'light':
        listIem.commands.push(getPinAction(action, state));
        break;
      case 'signal':
        listIem.commands.push(getPinAction(action, state == action.state));
        break;
      default: 
        // no op
        break;
    }
    return list;
  }, []).map(({ iFaceId, commands }) => {
      const comInterface = interfaces.interfaces[iFaceId];
      if (comInterface.type === 'serial') {
        comInterface.send(comInterface.connection, commands);
      }
  });
}

const getPinAction = ({ pin }, state) => ({ 
  action: 'pin', 
  payload: { pin, state: !!state }
});

export const exec = effects => {

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
    run(effect);
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
  put,
  exec
};
