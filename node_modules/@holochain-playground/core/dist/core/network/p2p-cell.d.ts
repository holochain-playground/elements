import { AgentPubKey, CapSecret, CellId, DHTOp, Dictionary, Element, Hash } from '@holochain-open-dev/core-types';
import { MiddlewareExecutor } from '../../executor/middleware-executor';
import { GetOptions } from '../../types';
import { Cell } from '../cell';
import { Network } from './network';
import { NetworkRequestInfo } from './network-request';
export declare type P2pCellState = {
    neighbors: AgentPubKey[];
    farKnownPeers: AgentPubKey[];
    redundancyFactor: number;
    neighborNumber: number;
};
export declare class P2pCell {
    protected cellId: CellId;
    protected network: Network;
    neighbors: AgentPubKey[];
    farKnownPeers: AgentPubKey[];
    redundancyFactor: number;
    neighborNumber: number;
    networkRequestsExecutor: MiddlewareExecutor<NetworkRequestInfo>;
    constructor(state: P2pCellState, cellId: CellId, network: Network);
    getState(): P2pCellState;
    /** P2p actions */
    join(containerCell: Cell): Promise<void>;
    leave(): Promise<void>;
    publish(dht_hash: Hash, ops: Dictionary<DHTOp>): Promise<void>;
    get(dht_hash: Hash, options: GetOptions): Promise<Element | undefined>;
    call_remote(agent: AgentPubKey, zome: string, fnName: string, cap: CapSecret | undefined, payload: any): Promise<any>;
    /** Neighbor handling */
    getNeighbors(): Array<AgentPubKey>;
    addNeighbor(neighborPubKey: AgentPubKey): void;
    syncNeighbors(): Promise<void>;
    private _executeNetworkRequest;
}
