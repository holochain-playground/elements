import { Task } from '../../../executor/executor';
import { CellState } from '../../../types/cell-state';
import { elementToDHTOps } from '../../../types/dht-op';
import { Cell } from '../../cell';
import { getElement } from '../source-chain/utils';

export function publish_dht_ops_task(cell: Cell): Task<void> {
  return {
    name: 'Publish DHT Ops',
    description:
      'Read the elements in the authored DHT Ops that have not been published and publish them',
    task: () => publish_dht_ops(cell),
  };
}

export const publish_dht_ops = async (cell: Cell): Promise<void> => {
  cell.conductor.network.publish(cell.cellId)
};
