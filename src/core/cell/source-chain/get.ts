import { CellState } from '../../../types/cell-state';

/**
 * Returns the header hashes which don't have their DHTOps in the authoredDHTOps DB
 */
export function getNewHeaders(state: CellState): Array<string> {
  return state.sourceChain.filter(
    (headerHash) => !Object.keys(state.authoredDHTOps).includes(headerHash)
  );
}
