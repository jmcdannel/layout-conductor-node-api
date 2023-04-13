
import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const EFFECTS = 'effects';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const save = effects => {
  const modPath = path.resolve(__dirname, modulePath(EFFECTS));
  writeFile(modPath, JSON.stringify(effects), function(err) {
    if (err) throw err;
    console.log('complete');
  });
}

export const get = () => {
  console.log('effects.get');
  return module(EFFECTS);
}

export const put = ({ Id, data}) => {
  const effects = get();
  const effect = effects.find(e => e.effectId === Id );
  if (effect) {
    effect.state = data.state;
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
