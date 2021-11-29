import {
  Conductor,
  SimulatedDna,
  SimulatedDnaSlot,
  SimulatedHappBundle,
} from '@holochain-playground/core';
import {
  AgentPubKeyB64,
  AnyDhtHashB64,
  Dictionary,
  DnaHashB64,
} from '@holochain-open-dev/core-types';
import { Context, createContext } from '@lit-labs/context';
import { PlaygroundStore } from '../store/playground-store';
import { PlaygroundMode } from '../store/mode';

export interface PlaygroundContextOld {
  activeDna: DnaHashB64;
  activeAgentPubKey: AgentPubKeyB64 | undefined;
  activeHash: AnyDhtHashB64 | undefined;
  conductors: Conductor[];
  conductorsUrls: string[] | undefined;
  happs: Dictionary<LightHappBundle>; // Indexed by happId
  dnas: Dictionary<SimulatedDna>; // Indexed by dna hash
}

export type PlaygroundContext<T extends PlaygroundMode> = Context<
  PlaygroundStore<T>
>;

export const playgroundContext: PlaygroundContext<any> = createContext(
  'holochain-playground/store'
);

export interface LightDnaSlot {
  dnaHash: DnaHashB64;
  deferred: boolean;
}
export interface LightHappBundle {
  name: string;
  description: string;
  slots: Dictionary<LightDnaSlot>;
}

export function buildHappBundle(
  context: PlaygroundContextOld,
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
