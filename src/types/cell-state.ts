import { CasMetadata } from './cas-metadata';
import { Dictionary } from './common';
import { DHTOp } from './dht-op';

export interface CellState {
  sourceChain: string[];
  CAS: Dictionary<any>;
  CASMeta: Dictionary<CasMetadata>; // For the moment only DHT shard
  integratedDHTOps: Dictionary<DHTOp>;
  authoredDHTOps: Dictionary<DHTOp[]>;
}
