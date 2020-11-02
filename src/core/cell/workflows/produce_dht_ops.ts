import { Task } from '../../../executor/executor';
import { hash } from '../../../processors/hash';
import { AuthoredDhtOpsValue, CellState } from '../../../types/cell-state';
import { elementToDHTOps } from '../../../types/dht-op';
import { Cell } from '../../cell';
import { getElement } from '../source-chain/utils';
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

    for (const dhtOp of dhtOps) {
      const dhtOpHash = await hash(dhtOp);
      const dhtOpValue = {
        op: dhtOp,
        last_publish_time: undefined,
        receipt_count: 0,
      };

      cell.state.authoredDHTOps[dhtOpHash] = dhtOpValue;
    }
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
