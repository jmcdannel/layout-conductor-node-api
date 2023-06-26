import { getById as getEffectById } from '../modules/effects.mjs';
import interfaces from '../communication/interfaces.mjs';
import log from '../core/logger.mjs';

const tunroutCommand = turnout => {
  switch(turnout.config.type) {
    case 'kato':
      return {
        iFaceId: turnout.config.interface,
        action: 'turnout', 
        payload: { 
          turnout: turnout.config.turnoutIdx, 
          state: turnout.state 
        }
      };
    case 'servo':
      return {
        iFaceId: turnout.config.interface,
        action: 'servo', 
        payload: { 
          servo: turnout.config.servo, 
          value: turnout.state 
            ? turnout.config.straight 
            : turnout.config.divergent, 
          current: !turnout.state 
            ? turnout.config.straight 
            : turnout.config.divergent
        }
      };
    default:
      // no op
      break;
  }
}

const pinCommand = ({ pin, interface: iFaceId }, state, delay) => ({ 
  iFaceId,
  delay,
  action: 'pin', 
  payload: { pin, state: !!state }
});

const soundCommand = ({ file, interface: iFaceId }, state, delay) => ({ 
  iFaceId,
  delay,
  action: 'sound', 
  payload: { file, state: !!state }
});

const effectCommand = (effect, action, delay) => {
  switch(effect.type) {
    case 'light':
    case 'frog':
      return pinCommand(action, effect.state, delay);
    case 'signal':
      return pinCommand(action, effect.state == action.state, delay);
    case 'sound':
      return soundCommand(action, effect.state == action.state, delay);
    default: 
      // no op
      break;
  }
}

export const build = (module, commandType) => {
  let commandList = [];
  switch(commandType) {
    case 'turnout':
      const turnout = module;
      commandList.push(tunroutCommand(turnout));
      // TO DO: refactor
      turnout.effects && turnout.effects.filter(efx => !efx.delay).map(turnoutEffect => {
        const effect = getEffectById(turnoutEffect.effectId);
        effect.state = turnoutEffect.state;
        const effectCommandList = effect?.actions.map(action => effectCommand(effect, action, turnoutEffect.delay));
        commandList = commandList.concat(effectCommandList);
      });
      break;
    case 'effect':
      const effect = module;
      const effectCommandList = module.actions.map(action => effectCommand(effect, action));
      commandList = commandList.concat(effectCommandList);
      break;
    default: 
      // no op
      break;
  }
  log.debug('[COMMANDS] commandList', commandList);
  return commandList;
}

export const send = (commands) => {
  const coms = [...new Set(commands.map(cmd => cmd.iFaceId))];
  log.debug('[COMMANDS] coms', coms);
  const cmdFormatter = ({ action, payload }) => ({ action, payload });
  coms.map(iFaceId => {
    const { send, connection } = interfaces.interfaces[iFaceId];
    send(connection, commands.map(cmdFormatter));
  });
};

export default {
  send,
  build
}
