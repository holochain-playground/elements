import {
  CellState,
  IntegrationLimboValue,
  ValidationLimboStatus,
  ValidationLimboValue,
} from '../../../types/cell-state';
import { Dictionary, Hash } from '../../../types/common';
import { Header } from '../../../types/header';

export function getValidationLimboDhtOps(
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

export function pullAllIntegrationLimboDhtOps(
  state: CellState
): Dictionary<IntegrationLimboValue> {
  const dhtOps = state.integrationLimbo;

  state.integrationLimbo = {};

  return dhtOps;
}

export function getHeadersForEntry(
  state: CellState,
  entryHash: Hash
): Header[] {
  return state.metadata.system_meta[entryHash]
    .filter(
      (h) =>
        (h as {
          NewEntry: Hash;
        }).NewEntry
    )
    .map(
      (h) =>
        state.CAS[
          (h as {
            NewEntry: Hash;
          }).NewEntry
        ]
    );
}
