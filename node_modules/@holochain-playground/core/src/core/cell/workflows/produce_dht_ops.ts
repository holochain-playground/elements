import { elementToDHTOps } from '@holochain-open-dev/core-types';
import { hash, HashType } from '../../../processors/hash';
import { Cell, Workflow } from '../../cell';
import { getNewHeaders } from '../source-chain/get';
import { getElement } from '../source-chain/utils';
import { publish_dht_ops_task } from './publish_dht_ops';
import { WorkflowType } from './workflows';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/produce_dht_ops_workflow.rs
export const produce_dht_ops = async (cell: Cell): Promise<void> => {
  const newHeaderHashes = getNewHeaders(cell.state);

  for (const newHeaderHash of newHeaderHashes) {
    const element = getElement(cell.state, newHeaderHash);
    const dhtOps = elementToDHTOps(element);

    for (const dhtOp of dhtOps) {
      const dhtOpHash = hash(dhtOp, HashType.DHTOP);
      const dhtOpValue = {
        op: dhtOp,
        last_publish_time: undefined,
        receipt_count: 0,
      };

      cell.state.authoredDHTOps[dhtOpHash] = dhtOpValue;
    }
  }
};

export type ProduceDhtOpsWorkflow = Workflow<void, void>;

export function produce_dht_ops_task(cell: Cell): ProduceDhtOpsWorkflow {
  return {
    type: WorkflowType.PRODUCE_DHT_OPS,
    details: undefined,
    task: () => produce_dht_ops(cell),
    triggers: [publish_dht_ops_task(cell)],
  };
}
