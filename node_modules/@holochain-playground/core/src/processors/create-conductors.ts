import { BootstrapService } from '../bootstrap/bootstrap-service';
import { Conductor } from '../core/conductor';
import { SimulatedDnaTemplate } from '../dnas/simulated-dna';
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

const config: Config = {
  dictionaries: [names],
};

export async function createConductors(
  conductorsToCreate: number,
  currentConductors: Conductor[],
  dnaTemplate: SimulatedDnaTemplate
): Promise<Conductor[]> {
  const bootstrapService =
    currentConductors.length === 0
      ? new BootstrapService()
      : currentConductors[0].network.bootstrapService;

  const newConductorsPromises: Promise<Conductor>[] = [];
  for (let i = 0; i < conductorsToCreate; i++) {
    const characterName: string = uniqueNamesGenerator(config);
    const conductor = Conductor.create(bootstrapService, characterName);
    newConductorsPromises.push(conductor);
  }

  const newConductors = await Promise.all(newConductorsPromises);

  const allConductors = [...currentConductors, ...newConductors];

  await Promise.all(
    allConductors.map(async c => {
      const dnaHash = await c.registerDna(dnaTemplate);
      await c.installApp(dnaHash, null, null, '');
    })
  );

  return allConductors;
}
