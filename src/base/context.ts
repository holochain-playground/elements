import {
  Conductor,
  SimulatedDna,
  SimulatedDnaSlot,
  SimulatedHappBundle,
} from '@holochain-playground/core';
import { Dictionary, Hash } from '@holochain-open-dev/core-types';

export interface PlaygroundContext {
  activeDna: Hash;
  activeAgentPubKey: Hash | undefined;
  activeHash: Hash | undefined;
  conductors: Conductor[];
  conductorsUrls: string[] | undefined;
  happs: Dictionary<LightHappBundle>; // Indexed by happId
  dnas: Dictionary<SimulatedDna>; // Indexed by dna hash
}

export interface LightDnaSlot {
  dnaHash: Hash;
  deferred: boolean;
}
export interface LightHappBundle {
  name: string;
  description: string;
  slots: Dictionary<LightDnaSlot>;
}

export function buildHappBundle(
  context: PlaygroundContext,
  happId: string
): SimulatedHappBundle {
  const slots: Dictionary<SimulatedDnaSlot> = {};
  const ligthHapp = context.happs[happId];

  if (!ligthHapp) throw new Error('There is no happ with the given id');

  for (const [slotNick, dnaSlot] of Object.entries(ligthHapp.slots)) {
    slots[slotNick] = {
      deferred: dnaSlot.deferred,
      dna: context.dnas[dnaSlot.dnaHash],
    };
  }

  const happBundle: SimulatedHappBundle = {
    ...ligthHapp,
    slots,
  };
  return happBundle;
}
