
import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import log from '../core/logger.mjs';

const LOCOS = 'locos';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const save = locos => {
  const modPath = path.resolve(__dirname, modulePath(LOCOS));
  writeFile(modPath, JSON.stringify(locos), function(err) {
    if (err) throw err;
    log.success(' save locos complete');
  });
}

export const get = () => {
  log.debug('locos.get');
  return module(LOCOS);
}

export const put = ({ Id, data}) => {
  const locos = get();
  let loco = locos.find(e => e.address === Id );
  if (loco) {
    loco = {...loco, ...data};
    save(locos);
  }
  return locos;
}

export const process = payload => {
  return payload?.Id && payload?.data ? put(payload) : get();
}

export default {
  get,
  process,
  put
};
