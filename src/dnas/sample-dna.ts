import { create } from '../core/cell/source-chain/actions';
import { hash } from '../processors/hash';
import { SimulatedDna, SimulatedZome } from './simulated-dna';

export const sampleZome: SimulatedZome = {
  create: () => [
    create(
      { entry_type: 'App', content: { hi: 'hi' } },
      { App: 'sample_type' }
    ),
  ],
};

export function sampleDna(): SimulatedDna {
  const zomes = {
    sample: sampleZome,
  };
  return {
    hash: hash(zomes),
    zomes,
  };
}
