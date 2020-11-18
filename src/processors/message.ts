import { Conductor } from '../core/conductor';
export function hookUpConductors(conductors: Conductor[]) {
  for (let i = 1; i < conductors.length; i++) {
    for (let j = 0; j < i; j++) {
      conductors[i].network.connectWith(conductors[j]);
    }
  }
}
