import { Conductor, SimulatedHappBundle } from '@holochain-playground/core';
import { Dictionary, Hash } from '@holochain-open-dev/core-types';

export interface PlaygroundContext {
  activeDna: Hash;
  activeAgentPubKey: Hash | undefined;
  activeHash: Hash | undefined;
  conductors: Conductor[];
  conductorsUrls: string[] | undefined;
  happs: Dictionary<SimulatedHappBundle>;
}
