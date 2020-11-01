import { Task } from '../../executor/executor';
import { CellState } from '../../types/cell-state';
import { elementToDHTOps } from '../../types/dht-op';
import { Cell } from '../cell';
import { getElement } from '../cell/source-chain/utils';
import { publish_dht_ops_task } from './publish_dht_ops';

export function produce_dht_ops_task(cell: Cell): Task<void> {
  return {
    name: 'Produce DHT Ops',
    description:
      'Read the new elements in the source chain and produce their appropriate DHT Ops',
    task: () => produce_dht_ops(cell),
  };
}

export const produce_dht_ops = async (cell: Cell): Promise<void> => {
  const newHeaderHashes = getNewHeaders(cell.state);

  for (const newHeaderHash of newHeaderHashes) {
    const element = getElement(cell.state, newHeaderHash);
    const dhtOps = await elementToDHTOps(element);

    cell.state.authoredDHTOps[newHeaderHash] = dhtOps;
  }

  cell.triggerWorkflow(publish_dht_ops_task(cell));
};

/**
 * Returns the header hashes which don't have their DHTOps in the authoredDHTOps DB
 */
export function getNewHeaders(state: CellState): Array<string> {
  return state.sourceChain.filter((headerHash) =>
    Object.keys(state.authoredDHTOps).includes(headerHash)
  );
}
