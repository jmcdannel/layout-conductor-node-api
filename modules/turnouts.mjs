import { module, path as modulePath }  from './layout.mjs';
import { writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import interfaces from '../communication/interfaces.mjs';
import log from '../core/logger.mjs';

const TURNOUTS = 'turnouts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const turnoutList =  module(TURNOUTS);

const save = turnouts => {
  const modPath = path.resolve(__dirname, modulePath(TURNOUTS));
  writeFile(modPath, JSON.stringify(turnouts), function(err) {
    if (err) throw err;
    log.log('[TURNOUTS] saved');
  });
}

const run = (turnout) => {
  interfaces.handleCommands(turnout, 'turnout');
}

export const getById = Id => {
  return turnoutList.find(e => e.turnoutId === Id );
}

export const get = ({ Id} ) => {
  log.debug('[TURNOUTS] get');
  return Id ? getById(Id) : turnoutList;
}

export const put = ({ Id, data }) => {
  const turnout = turnoutList.find(e => e.turnoutId === Id );
  if (turnout) {
    turnout.state = data.state;
    run(turnout);
    save(turnoutList);
  }
  return turnoutList;
}

export const process = payload => {
  return payload?.Id && payload?.data ? put(payload) : get();
}

export default {
  get,
  process,
  put,
  getById
};
