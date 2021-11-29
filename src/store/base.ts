import { Element } from '@holochain-open-dev/core-types';
import { CellMap } from '@holochain-playground/core';
import { AgentPubKey, AnyDhtHash, DnaHash } from '@holochain/conductor-api';
import { get, Readable, writable, Writable } from 'svelte/store';
import { PlaygroundMode } from './mode';

export abstract class CellStore<T extends PlaygroundMode> {
  type: T;
  abstract sourceChain: Readable<Element[]>;
}

export abstract class ConductorStore<T extends PlaygroundMode> {
  type: T;

  abstract cells: Readable<CellMap<CellStore<T>>>;
}

export abstract class PlaygroundStore<T extends PlaygroundMode> {
  type: T;

  activeDna: Writable<DnaHash | undefined>;
  activeAgentPubKey: Writable<AgentPubKey | undefined> = writable(undefined);
  activeDhtHash: Writable<AnyDhtHash | undefined> = writable(undefined);

  abstract conductors: Readable<Array<ConductorStore<T>>>;

  constructor() {
    const { set, subscribe, update } = writable(undefined);

    this.activeDna = {
      subscribe,
      update,
      set: (v: DnaHash) => {
        this.activeDhtHash.set(undefined);
        const currentConductors = get(this.conductors);

        if (
          !currentConductors.find((c) => {
            const cells = get(c.cells);
            cells.has([v, get(this.activeAgentPubKey)]);
          })
        ) {
          this.activeAgentPubKey.set(undefined);
        }

        set(v);
      },
    };
  }
}
