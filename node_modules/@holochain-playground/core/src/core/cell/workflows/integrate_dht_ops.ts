import { Cell, Workflow } from '../../cell';
import { IntegratedDhtOpsValue } from '../state';
import { pullAllIntegrationLimboDhtOps } from '../dht/get';
import {
  putDhtOpData,
  putDhtOpMetadata,
  putDhtOpToIntegrated,
} from '../dht/put';
import { WorkflowType } from './workflows';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/integrate_dht_ops_workflow.rs
export const integrate_dht_ops = async (cell: Cell): Promise<void> => {
  const opsToIntegrate = pullAllIntegrationLimboDhtOps(cell.state);

  for (const dhtOpHash of Object.keys(opsToIntegrate)) {
    const integrationLimboValue = opsToIntegrate[dhtOpHash];

    const dhtOp = integrationLimboValue.op;

    await putDhtOpData(dhtOp)(cell.state);
    putDhtOpMetadata(dhtOp)(cell.state);

    const value: IntegratedDhtOpsValue = {
      op: dhtOp,
      validation_status: integrationLimboValue.validation_status,
      when_integrated: Date.now(),
    };

    putDhtOpToIntegrated(dhtOpHash, value)(cell.state);
  }
};

export type IntegrateDhtOpsWorkflow = Workflow<void, void>;

export function integrate_dht_ops_task(cell: Cell): IntegrateDhtOpsWorkflow {
  return {
    type: WorkflowType.INTEGRATE_DHT_OPS,
    details: undefined,
    task: () => integrate_dht_ops(cell),
  };
}
