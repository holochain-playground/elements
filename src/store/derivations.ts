import { CellMap } from '@holochain-playground/core';
import { derived, Readable } from 'svelte/store';

import { PlaygroundMode } from './mode';
import { CellStore, PlaygroundStore } from './base';
import { unnest } from './unnest';

export function activeCellStore<T extends PlaygroundMode>(
  playgroundStore: PlaygroundStore<T>
): Readable<CellStore<T> | undefined> {
  return derived(
    [
      playgroundStore.activeDna,
      playgroundStore.activeAgentPubKey,
      allCellsStore(playgroundStore),
    ],
    ([dnaHash, agentPubKey, cellMap]) => {
      if (!dnaHash || !agentPubKey) return undefined;

      return cellMap.get([dnaHash, agentPubKey]);
    }
  );
}

export function allCellsStore<T extends PlaygroundMode>(
  playgroundStore: PlaygroundStore<T>
): Readable<CellMap<CellStore<T>>> {
  return unnest(playgroundStore.conductors, (conductors) =>
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
