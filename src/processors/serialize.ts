import { Conductor } from '../core/conductor';
import { PlaygroundContext } from '../elements/utils/context';
import { hookUpConductors } from './message';

export function serializePlayground(state: PlaygroundContext): string {
  if (!state) return '';

  const conductorStates = state.conductors.map((c) => c.getState());

  const preState = {
    ...state,
    conductors: conductorStates,
  };
  return JSON.stringify(preState);
}

export function deserializePlayground(stateString: string): PlaygroundContext {
  if (stateString === '') return null;

  const preState = JSON.parse(stateString);

  const conductors = preState.conductors.map((c) => new Conductor(c));

  hookUpConductors(conductors);

  return {
    ...preState,
    conductors,
  };
}
