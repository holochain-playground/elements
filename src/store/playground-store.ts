import { Element } from '@holochain-open-dev/core-types';
import { CellMap, HoloHashMap } from '@holochain-playground/core';
import {
  AgentPubKey,
  AnyDhtHash,
  DhtOp,
  DnaHash,
} from '@holochain/conductor-api';
import isEqual from 'lodash-es/isEqual';
import { derived, get, Readable, writable, Writable } from 'svelte/store';

import { PlaygroundMode } from './mode';
import { unnest } from './unnest';

export abstract class CellStore<T extends PlaygroundMode> {
  type: T;
  abstract sourceChain: Readable<Element[]>;
  abstract peers: Readable<AgentPubKey[]>;
  abstract dhtShard: Readable<Array<DhtOp>>;
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

        const activePubKey = get(this.activeAgentPubKey);
        if (
          activePubKey &&
          !currentConductors.find((c) => get(c.cells).has([v, activePubKey]))
        ) {
          this.activeAgentPubKey.set(undefined);
        }

        set(v);
      },
    };
  }

  activeCell(): Readable<CellStore<T> | undefined> {
    return derived(
      [this.activeDna, this.activeAgentPubKey, this.allCells()],
      ([dnaHash, agentPubKey, cellMap]) => {
        if (!dnaHash || !agentPubKey) return undefined;

        return cellMap.get([dnaHash, agentPubKey]);
      }
    );
  }

  allCells(): Readable<CellMap<CellStore<T>>> {
    return unnest(this.conductors, (conductors) =>
      derived(
        conductors.map((c) => c.cells),
        (cellMaps) =>
          cellMaps.reduce((acc, next) => {
            for (const [cellId, store] of next.entries()) {
              acc.put(cellId, store);
            }
            return acc;
          }, new CellMap())
      )
    );
  }

  cellsForActiveDna(): Readable<CellMap<CellStore<T>>> {
    return derived(
      [this.activeDna, this.allCells()],
      ([activeDna, allCells]) => {
        const map = new CellMap<CellStore<T>>();

        for (const [cellId, value] of allCells.entries()) {
          if (isEqual(activeDna, cellId[0])) {
            map.put(cellId, value);
          }
        }
        return map;
      }
    );
  }
}
