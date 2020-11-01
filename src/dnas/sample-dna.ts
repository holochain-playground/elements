import { create } from '../core/cell/source-chain/actions';
import { SimulatedDna, SimulatedZome } from './simulated-dna';

export const sampleZome: SimulatedZome = {
  create: () => [
    create(
      { entry_type: 'App', content: { hi: 'hi' } },
      { App: 'sample_type' }
    ),
  ],
};

export const sampleDna: SimulatedDna = {
  sample: sampleZome,
};
