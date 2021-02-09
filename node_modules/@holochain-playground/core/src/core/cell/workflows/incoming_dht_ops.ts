import {
  Hash,
  Dictionary,
  DHTOp,
  AgentPubKey,
} from '@holochain-open-dev/core-types';
import { Cell, Workflow } from '../../cell';
import { ValidationLimboValue, ValidationLimboStatus } from '../state';
import { putValidationLimboValue } from '../dht/put';
import { sys_validation_task } from './sys_validation';
import { WorkflowType } from './workflows';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/incoming_dht_ops_workflow.rs
export const incoming_dht_ops = (
  basis: Hash,
  dhtOps: Dictionary<DHTOp>,
  from_agent: AgentPubKey | undefined
) => async (cell: Cell): Promise<void> => {
  for (const dhtOpHash of Object.keys(dhtOps)) {
    const dhtOp = dhtOps[dhtOpHash];

    const validationLimboValue: ValidationLimboValue = {
      basis,
      from_agent,
      last_try: undefined,
      num_tries: 0,
      op: dhtOp,
      status: ValidationLimboStatus.Pending,
      time_added: Date.now(),
    };

    putValidationLimboValue(dhtOpHash, validationLimboValue)(cell.state);
  }

  cell.triggerWorkflow(sys_validation_task(cell));
};

export type IncomingDhtOpsWorkflow = Workflow<
  { from_agent: AgentPubKey; dht_hash: Hash; ops: Dictionary<DHTOp> },
  void
>;

export function incoming_dht_ops_task(
  cell: Cell,
  from_agent: AgentPubKey,
  dht_hash: Hash, // The basis for the DHTOps
  ops: Dictionary<DHTOp>
): IncomingDhtOpsWorkflow {
  return {
    type: WorkflowType.INCOMING_DHT_OPS,
    details: {
      from_agent,
      dht_hash,
      ops,
    },
    task: () => incoming_dht_ops(dht_hash, ops, from_agent)(cell),
  };
}
