import { CellId } from '@holochain/conductor-api';
import isEqual from 'lodash-es/isEqual';

export function cellChanges(
  currentCellIds: CellId[],
  targetCellIds: CellId[]
): { cellsToAdd: CellId[]; cellsToRemove: CellId[] } {
  const cellsToAdd = targetCellIds.filter(
    (cellId) => !contains(currentCellIds, cellId)
  );
  const cellsToRemove = currentCellIds.filter(
    (cellId) => !contains(targetCellIds, cellId)
  );

  return {
    cellsToAdd,
    cellsToRemove,
  };
}

export function contains(cellIds: CellId[], lookingForCellId: CellId) {
  return cellIds.find((c) => isEqual(c, lookingForCellId));
}
