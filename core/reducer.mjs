import layout from '../modules/layout.mjs';
import turnouts from '../modules/turnouts.mjs';
import routes from '../modules/routes.mjs';
import locos from '../modules/locos.mjs';
import effects from '../modules/effects.mjs';

export const reduce = ({ action, payload }) => {
  let res = {};
  switch(action) {
    case 'initialize':
      res = layout.get(payload);
      break;
    case 'turnouts':
      res = turnouts.process(payload);
      break;
    case 'routes':
      res = routes.get(payload);
      break;
    case 'locos':
      res = locos.process(payload);
      break;
    case 'effects':
      res = effects.process(payload);
      break;
    defualt:
      break;
  }
  return res;
}

export default reduce;