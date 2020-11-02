import { CasMetadata } from './cas-metadata';
import { Dictionary } from './common';
import { DHTOp } from './dht-op';

export interface CellState {
  sourceChain: string[];
  CAS: Dictionary<any>;
  CASMeta: Dictionary<CasMetadata>; // For the moment only DHT shard
  integratedDHTOps: Dictionary<DHTOp>;
  authoredDHTOps: Dictionary<AuthoredDhtOpsValue>; // Key is the hash of the DHT op
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/state/dht_op_integration.rs
export interface AuthoredDhtOpsValue {
  op: DHTOp;
  receipt_count: number;
  last_publish_time: number | undefined;
}