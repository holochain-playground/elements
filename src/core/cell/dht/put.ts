import { hash } from '../../../processors/hash';
import {
  CellState,
  IntegratedDhtOpsValue,
  IntegrationLimboValue,
  ValidationLimboValue,
} from '../../../types/cell-state';
import { Hash } from '../../../types/common';
import { DHTOp, DHTOpType, getEntry } from '../../../types/dht-op';
import { hashEntry } from '../../../types/entry';
import { Header, HeaderType } from '../../../types/header';
import {
  ChainStatus,
  EntryDhtStatus,
  LinkMetaKey,
  LinkMetaVal,
  SysMetaVal,
} from '../../../types/metadata';
import { getHeadersForEntry } from './get';

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

export const putDhtOpData = (dhtOp: DHTOp) => async (state: CellState) => {
  const headerHash = hash(dhtOp.header);
  state.CAS[headerHash] = dhtOp.header;

  const entry = getEntry(dhtOp);

  if (entry) {
    const entryHash = hashEntry(entry);
    state.CAS[entryHash] = entry;
  }
};

export const putDhtOpMetadata = (dhtOp: DHTOp) => async (state: CellState) => {
  const headerHash = hash(dhtOp.header);

  if (dhtOp.type === DHTOpType.StoreElement) {
    state.metadata.misc_meta[headerHash] = 'StoreElement';
  } else if (dhtOp.type === DHTOpType.StoreEntry) {
    const entryHash = dhtOp.header.entry_hash;

    if (dhtOp.header.type === HeaderType.Update) {
      await register_header_on_basis(headerHash, dhtOp.header)(state);
      await register_header_on_basis(entryHash, dhtOp.header)(state);
    }

    await register_header_on_basis(entryHash, dhtOp.header)(state);
    update_entry_dht_status(entryHash)(state);
  } else if (dhtOp.type === DHTOpType.RegisterAgentActivity) {
    state.metadata.misc_meta[headerHash] = {
      ChainItem: dhtOp.header.timestamp,
    };

    state.metadata.misc_meta[dhtOp.header.author] = {
      ChainStatus: ChainStatus.Valid,
    };
  } else if (
    dhtOp.type === DHTOpType.RegisterUpdatedContent ||
    dhtOp.type === DHTOpType.RegisterUpdatedElement
  ) {
    await register_header_on_basis(
      dhtOp.header.original_header_address,
      dhtOp.header
    )(state);
    await register_header_on_basis(
      dhtOp.header.original_entry_address,
      dhtOp.header
    )(state);
    update_entry_dht_status(dhtOp.header.original_entry_address)(state);
  } else if (
    dhtOp.type === DHTOpType.RegisterDeletedBy ||
    dhtOp.type === DHTOpType.RegisterDeletedEntryHeader
  ) {
    await register_header_on_basis(
      dhtOp.header.deletes_address,
      dhtOp.header
    )(state);
    await register_header_on_basis(
      dhtOp.header.deletes_entry_address,
      dhtOp.header
    )(state);

    update_entry_dht_status(dhtOp.header.deletes_entry_address)(state);
  } else if (dhtOp.type === DHTOpType.RegisterAddLink) {
    const key: LinkMetaKey = {
      base: dhtOp.header.base_address,
      header_hash: headerHash,
      tag: dhtOp.header.tag,
      zome_id: dhtOp.header.zome_id,
    };
    const value: LinkMetaVal = {
      link_add_hash: headerHash,
      tag: dhtOp.header.tag,
      target: dhtOp.header.target_address,
      timestamp: dhtOp.header.timestamp,
      zome_id: dhtOp.header.zome_id,
    };
    state.metadata.link_meta.push({ key, value });
  } else if (dhtOp.type === DHTOpType.RegisterRemoveLink) {
    const val: SysMetaVal = {
      DeleteLink: headerHash,
    };

    putSystemMetadata(dhtOp.header.link_add_address, val)(state);
  }
};

const update_entry_dht_status = (entryHash: string) => (state: CellState) => {
  const headers = getHeadersForEntry(state, entryHash);

  const entryIsAlive = headers.some((header) =>
    state.metadata.system_meta[hash(header)].find(
      (metaVal) =>
        (metaVal as {
          Delete: Hash;
        }).Delete
    )
  );

  state.metadata.misc_meta[entryHash] = {
    EntryStatus: entryIsAlive ? EntryDhtStatus.Live : EntryDhtStatus.Dead,
  };
};

export const register_header_on_basis = (basis: Hash, header: Header) => async (
  state: CellState
) => {
  const headerHash = await hash(header);
  let value: SysMetaVal = undefined;
  if (header.type === HeaderType.Create) {
    value = { NewEntry: headerHash };
  } else if (header.type === HeaderType.Update) {
    value = { Update: headerHash };
  } else if (header.type === HeaderType.Delete) {
    value = { Delete: headerHash };
  }

  putSystemMetadata(basis, value)(state);
};

export const putSystemMetadata = (basis: string, value: SysMetaVal) => (
  state: CellState
) => {
  if (!state.metadata.system_meta[basis]) {
    state.metadata.system_meta[basis] = [];
  }

  state.metadata.system_meta[basis].push(value);
};

export const putDhtOpToIntegrated = (
  dhtOpHash: Hash,
  integratedValue: IntegratedDhtOpsValue
) => (state: CellState) => {
  state.integratedDHTOps[dhtOpHash] = integratedValue;
};
