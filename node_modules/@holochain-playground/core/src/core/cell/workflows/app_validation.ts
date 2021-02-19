import { Cell, Workflow } from '../../cell';
import {
  ValidationLimboStatus,
  IntegrationLimboValue,
  ValidationStatus,
} from '../state';
import { getValidationLimboDhtOps } from '../dht/get';
import {
  deleteValidationLimboValue,
  putIntegrationLimboValue,
} from '../dht/put';
import { integrate_dht_ops_task } from './integrate_dht_ops';
import { WorkflowReturn, WorkflowType } from './workflows';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/app_validation_workflow.rs
export const app_validation = async (
  cell: Cell
): Promise<WorkflowReturn<void>> => {
  const pendingDhtOps = getValidationLimboDhtOps(
    cell.state,
    ValidationLimboStatus.SysValidated
  );

  // TODO: actually validate
  for (const dhtOpHash of Object.keys(pendingDhtOps)) {
    deleteValidationLimboValue(dhtOpHash)(cell.state);

    const validationLimboValue = pendingDhtOps[dhtOpHash];

    const value: IntegrationLimboValue = {
      op: validationLimboValue.op,
      validation_status: ValidationStatus.Valid,
    };

    putIntegrationLimboValue(dhtOpHash, value)(cell.state);
  }

  return {
    result: undefined,
    triggers: [integrate_dht_ops_task(cell)],
  };
};

export type AppValidationWorkflow = Workflow<any, any>;

export function app_validation_task(cell: Cell): AppValidationWorkflow {
  return {
    type: WorkflowType.APP_VALIDATION,
    details: undefined,
    task: () => app_validation(cell),
  };
}
