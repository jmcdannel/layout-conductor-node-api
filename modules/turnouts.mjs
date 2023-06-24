import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import log from '../core/logger.mjs';

import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const TURNOUTS = 'turnouts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const save = turnouts => {
  const modPath = path.resolve(__dirname, modulePath(TURNOUTS));
  writeFile(modPath, JSON.stringify(turnouts), function(err) {
    if (err) throw err;
    console.log('turnouts.save complete');
  });
}

export const get = () => {
  return module(TURNOUTS);
}

export default {
  get,
  process,
  put
};
