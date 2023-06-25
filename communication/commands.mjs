import { getById as getEffectById } from '../modules/effects.mjs';
import interfaces from '../communication/interfaces.mjs';

const tunroutCommand = turnout=> ({
  iFaceId: turnout.config.interface,
  action: 'turnout', 
  payload: { 
    turnout: turnout.config.turnoutIdx, 
    state: turnout.state 
  }
});

const pinCommand = ({ pin, interface: iFaceId }, state) => ({ 
  iFaceId,
  action: 'pin', 
  payload: { pin, state: !!state }
});

const effectCommand = (effect, action) => {
  switch(effect.type) {
    case 'light':
      return pinCommand(action, effect.state);
    case 'signal':
      return pinCommand(action, effect.state == action.state);
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
        const effectCommandList = effect?.actions.map(action => effectCommand(effect, action));
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
  return commandList;
}

export const send = (commands) => {
  const coms = [...new Set(commands.map(cmd => cmd.iFaceId))];
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
