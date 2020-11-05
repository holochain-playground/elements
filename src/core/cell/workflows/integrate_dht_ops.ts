import { Task } from '../../../executor/executor';
import { Cell } from '../../cell';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/integrate_dht_ops_workflow.rs
export const integrate_dht_ops = async (cell: Cell): Promise<void> => {
    
};

export function integrate_dht_ops_task(cell: Cell): Task<void> {
  return {
    name: 'Integrate DHT Ops',
    description: 'Integration of the validated DHTOp in our DHT shard',
    task: () => integrate_dht_ops(cell),
  };
}
