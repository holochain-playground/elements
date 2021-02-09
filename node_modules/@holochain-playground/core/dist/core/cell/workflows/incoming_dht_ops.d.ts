import { Hash, Dictionary, DHTOp, AgentPubKey } from '@holochain-open-dev/core-types';
import { Cell, Workflow } from '../../cell';
export declare const incoming_dht_ops: (basis: Hash, dhtOps: Dictionary<DHTOp>, from_agent: AgentPubKey | undefined) => (cell: Cell) => Promise<void>;
export declare type IncomingDhtOpsWorkflow = Workflow<{
    from_agent: AgentPubKey;
    dht_hash: Hash;
    ops: Dictionary<DHTOp>;
}, void>;
export declare function incoming_dht_ops_task(cell: Cell, from_agent: AgentPubKey, dht_hash: Hash, // The basis for the DHTOps
ops: Dictionary<DHTOp>): IncomingDhtOpsWorkflow;
