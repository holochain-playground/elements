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

export async function sampleDna(): Promise<SimulatedDna> {
  return {
    hash: await hash('asdfasf'),
    zomes: {
      sample: sampleZome,
    },
  };
}
