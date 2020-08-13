import { createConductors } from './create-conductors';
import { Conductor } from '../types/conductor';

export async function buildSimulatedPlayground(
  dna: string,
  numConductors: number
): Promise<Conductor[]> {
  const redundancyFactor = 3;

  return createConductors(numConductors, [], redundancyFactor, dna);
}
