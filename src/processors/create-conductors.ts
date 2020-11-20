import { Conductor } from '../core/conductor';
import { SimulatedDna } from '../dnas/simulated-dna';
import { hookUpConductors } from './message';

export async function createConductors(
  conductorsToCreate: number,
  currentConductors: Conductor[],
  dna: SimulatedDna
): Promise<Conductor[]> {
  const newConductors: Conductor[] = [];
  for (let i = 0; i < conductorsToCreate; i++) {
    const conductor = await Conductor.create();
    newConductors.push(conductor);
  }

  const allConductors = [...currentConductors, ...newConductors];

  for (const conductor of newConductors) {
    await conductor.installDna(dna, null);
  }

  hookUpConductors(allConductors);

  return allConductors;
}
