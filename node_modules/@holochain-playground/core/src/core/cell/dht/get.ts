import {
  Dictionary,
  Hash,
  Header,
  getSysMetaValHeaderHash,
  LinkMetaVal,
  EntryDhtStatus,
  EntryDetails,
  NewEntryHeader,
  SignedHeaderHashed,
  DHTOpType,
  Update,
  Delete,
} from '@holochain-open-dev/core-types';
import { isEqual, uniq } from 'lodash-es';
import {
  CellState,
  ValidationLimboStatus,
  ValidationLimboValue,
  IntegrationLimboValue,
} from '../state';

export function getValidationLimboDhtOps(
  state: CellState,
  status: ValidationLimboStatus
): Dictionary<ValidationLimboValue> {
  const pendingDhtOps: Dictionary<ValidationLimboValue> = {};

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
): SignedHeaderHashed[] {
  return state.metadata.system_meta[entryHash]
    .map(h => {
      const hash = getSysMetaValHeaderHash(h);
      if (hash) {
        return state.CAS[hash];
      }
      return undefined;
    })
    .filter(header => !!header);
}

export function getLinksForEntry(
  state: CellState,
  entryHash: Hash
): LinkMetaVal[] {
  return state.metadata.link_meta
    .filter(({ key, value }) => isEqual(key.base, entryHash))
    .map(({ key, value }) => value);
}

export function getEntryDhtStatus(
  state: CellState,
  entryHash: Hash
): EntryDhtStatus | undefined {
  const meta = state.metadata.misc_meta[entryHash];

  return meta
    ? (meta as {
        EntryStatus: EntryDhtStatus;
      }).EntryStatus
    : undefined;
}

export function getEntryDetails(
  state: CellState,
  entryHash: Hash
): EntryDetails {
  const entry = state.CAS[entryHash];
  const headers = getHeadersForEntry(state, entryHash);
  const dhtStatus = getEntryDhtStatus(state, entryHash);

  return {
    entry,
    headers: headers,
    entry_dht_status: dhtStatus as EntryDhtStatus,
  };
}

export function getHeaderModifiers(
  state: CellState,
  headerHash: Hash
): {
  updates: SignedHeaderHashed<Update>[];
  deletes: SignedHeaderHashed<Delete>[];
} {
  const allModifiers = state.metadata.system_meta[headerHash];
  const updates = allModifiers
    .filter(m => (m as { Update: Hash }).Update)
    .map(m => state.CAS[(m as { Update: Hash }).Update]);
  const deletes = allModifiers
    .filter(m => (m as { Delete: Hash }).Delete)
    .map(m => state.CAS[(m as { Delete: Hash }).Delete]);

  return {
    updates,
    deletes,
  };
}

export function getAllHeldEntries(state: CellState): Hash[] {
  const newEntryHeaders = Object.values(state.integratedDHTOps)
    .filter(dhtOpValue => dhtOpValue.op.type === DHTOpType.StoreEntry)
    .map(dhtOpValue => dhtOpValue.op.header);

  const allEntryHashes = newEntryHeaders.map(
    h => (h.header.content as NewEntryHeader).entry_hash
  );

  return uniq(allEntryHashes);
}

export function getAllAuthoredEntries(state: CellState): Hash[] {
  const allHeaders = Object.values(state.authoredDHTOps).map(
    dhtOpValue => dhtOpValue.op.header
  );

  const newEntryHeaders: SignedHeaderHashed<NewEntryHeader>[] = allHeaders.filter(
    h => (h.header.content as NewEntryHeader).entry_hash
  ) as SignedHeaderHashed<NewEntryHeader>[];

  return newEntryHeaders.map(h => h.header.content.entry_hash);
}

export function isHoldingEntry(state: CellState, entryHash: Hash): boolean {
  return state.metadata.system_meta[entryHash] !== undefined;
}

export interface EntryDHTInfo {
  details: EntryDetails;
  links: LinkMetaVal[];
}

export function getDhtShard(state: CellState): Dictionary<EntryDHTInfo> {
  const heldEntries = getAllHeldEntries(state);

  const dhtShard: Dictionary<EntryDHTInfo> = {};

  for (const entryHash of heldEntries) {
    dhtShard[entryHash] = {
      details: getEntryDetails(state, entryHash),
      links: getLinksForEntry(state, entryHash),
    };
  }

  return dhtShard;
}
