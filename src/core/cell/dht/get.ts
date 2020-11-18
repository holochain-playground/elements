import {
  CellState,
  IntegrationLimboValue,
  ValidationLimboStatus,
  ValidationLimboValue,
} from '../../../types/cell-state';
import { Dictionary, Hash } from '../../../types/common';
import { Header, NewEntryHeader } from '../../../types/header';
import {
  EntryDetails,
  EntryDhtStatus,
  getSysMetaValHeaderHash,
  LinkMetaVal,
} from '../../../types/metadata';

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
  return state.metadata.system_meta[entryHash].map(
    (h) => state.CAS[getSysMetaValHeaderHash(h)]
  );
}

export function getLinksForEntry(
  state: CellState,
  entryHash: Hash
): LinkMetaVal[] {
  return state.metadata.link_meta
    .filter(({ key, value }) => (key.base = entryHash))
    .map(({ key, value }) => value);
}

export function getEntryDhtStatus(
  state: CellState,
  entryHash: Hash
): EntryDhtStatus {
  return (state.metadata.misc_meta[entryHash] as {
    EntryStatus: EntryDhtStatus;
  }).EntryStatus;
}

export function getEntryDetails(
  state: CellState,
  entryHash: Hash
): EntryDetails {
  const headers = getHeadersForEntry(state, entryHash);
  const links = getLinksForEntry(state, entryHash);
  const dhtStatus = getEntryDhtStatus(state, entryHash);

  return {
    headers: headers as NewEntryHeader[],
    links,
    dhtStatus,
  };
}

export function getAllHeldEntries(state: CellState): string[] {
  const allHeaders = Object.values(state.integratedDHTOps).map(
    (dhtOpValue) => dhtOpValue.op.header
  );

  const newEntryHeaders = allHeaders.filter(
    (h) => (h as NewEntryHeader).entry_hash
  );

  return newEntryHeaders.map((h) => (h as NewEntryHeader).entry_hash);
}

export function isHoldingEntry(state: CellState, entryHash: Hash): boolean {
  return state.metadata.system_meta[entryHash] !== undefined;
}
