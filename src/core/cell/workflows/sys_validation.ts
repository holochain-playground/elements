import { Task } from '../../../executor/executor';
import { ValidationLimboStatus } from '../../../types/cell-state';
import { Cell } from '../../cell';
import { getLimboDhtOps } from '../dht/get';
import { putValidationLimboValue } from '../dht/put';
import { app_validation_task } from './app_validation';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/sys_validation_workflow.rs
export const sys_validation = async (cell: Cell): Promise<void> => {
  const pendingDhtOps = getLimboDhtOps(
    cell.state,
    ValidationLimboStatus.Pending
  );

  // TODO: actually validate
  for (const dhtOpHash of Object.keys(pendingDhtOps)) {
    const limboValue = pendingDhtOps[dhtOpHash];

    limboValue.status = ValidationLimboStatus.SysValidated;

    putValidationLimboValue(dhtOpHash, limboValue);
  }

  cell.triggerWorkflow(app_validation_task(cell));
};

export function sys_validation_task(cell: Cell): Task<void> {
  return {
    name: 'System Validation of the DHT Op',
    description: 'Subconscious checks of data integrity',
    task: () => sys_validation(cell),
  };
}
