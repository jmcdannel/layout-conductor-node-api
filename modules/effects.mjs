
import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import interfaces from '../communication/interfaces.mjs';
import log from '../core/logger.mjs';

const EFFECTS = 'effects';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const effectList =  module(EFFECTS);

const save = effects => {
  const modPath = path.resolve(__dirname, modulePath(EFFECTS));
  writeFile(modPath, JSON.stringify(effects), function(err) {
    if (err) throw err;
    log.success('[EFFECTS] save effects complete');
  });
}

const run = effect => {
  interfaces.handleCommands(effect, 'effect');
}

export const getById = Id => {
  return effectList.find(e => e.effectId === Id );
}

export const exec = effects => {

}

export const get = ({ Id} ) => {
  log.debug('[EFFECTS] effects.get');
  return Id ? getById(Id) : effectList;
}

export const put = ({ Id, data }) => {
  const effect = getById(Id);
  if (effect) {
    effect.state = data.state;
    run(effect);
    save(effects);
  }
  return effects;
}

export const process = payload => {
  return payload?.Id && payload?.data ? put(payload) : get(payload);
}

export default {
  get,
  process,
  put,
  exec,
  getById
};
