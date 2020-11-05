import { CellState, ValidationLimboStatus, ValidationLimboValue } from '../../../types/cell-state';
import { Dictionary } from '../../../types/common';

export function getLimboDhtOps(
  state: CellState,
  status: ValidationLimboStatus
): Dictionary<ValidationLimboValue> {
  const pendingDhtOps = {};

  for (const dhtOpHash of Object.keys(state.validationLimbo)) {
    const limboValue = state.validationLimbo[dhtOpHash];

    if (limboValue.status === status) {
      pendingDhtOps[dhtOpHash] = limboValue;
    }
  }

  return pendingDhtOps;
}
