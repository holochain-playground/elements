import {
  CellState,
  IntegrationLimboValue,
  ValidationLimboValue,
} from '../../../types/cell-state';
import { Hash } from '../../../types/common';

export const putValidationLimboValue = (
  dhtOpHash: Hash,
  validationLimboValue: ValidationLimboValue
) => (state: CellState) => {
  state.validationLimbo[dhtOpHash] = validationLimboValue;
};

export const deleteValidationLimboValue = (dhtOpHash: Hash) => (
  state: CellState
) => {
  state.validationLimbo[dhtOpHash] = undefined;
  delete state.validationLimbo[dhtOpHash];
};

export const putIntegrationLimboValue = (
  dhtOpHash: Hash,
  integrationLimboValue: IntegrationLimboValue
) => (state: CellState) => {
  state.integrationLimbo[dhtOpHash] = integrationLimboValue;
};
