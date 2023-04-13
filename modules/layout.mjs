
import { createRequire } from 'module';

const LOCAL_CONFIG_PATH = '../config/local/config.json';
const require = createRequire(import.meta.url);
const config = require(LOCAL_CONFIG_PATH);

export const get = () => {
  return config;
}

export const module = (type, layoutId = get().layoutId) => {
  return require(path(type, layoutId));
}

export const path = (type, layoutId = get().layoutId) => 
  `../config/${layoutId}/${type}.json`; 

export default {
  get,
  module,
  path
};
