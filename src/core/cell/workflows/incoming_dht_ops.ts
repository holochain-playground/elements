import {
  ValidationLimboStatus,
  ValidationLimboValue,
} from '../../../types/cell-state';
import { AgentPubKey, Dictionary, Hash } from '../../../types/common';
import { DHTOp } from '../../../types/dht-op';
import { Cell } from '../../cell';
import { putValidationLimboValue } from '../dht/put';
import { sys_validation_task } from './sys_validation';

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
