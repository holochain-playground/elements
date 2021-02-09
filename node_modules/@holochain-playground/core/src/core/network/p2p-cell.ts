import {
  AgentPubKey,
  CapSecret,
  CellId,
  DHTOp,
  Dictionary,
  Element,
  Hash,
} from '@holochain-open-dev/core-types';
import { MiddlewareExecutor } from '../../executor/middleware-executor';
import { GetOptions } from '../../types';
import { Cell } from '../cell';
import { GetElementFull, GetEntryFull } from '../cell/cascade/types';
import { Network } from './network';
import {
  NetworkRequestInfo,
  NetworkRequest,
  NetworkRequestType,
} from './network-request';

export type P2pCellState = {
  neighbors: Hash[];
  redundancyFactor: number;
};

// From: https://github.com/holochain/holochain/blob/develop/crates/holochain_p2p/src/lib.rs
export class P2pCell {
  neighbors: AgentPubKey[];

  redundancyFactor: number;

  networkRequestsExecutor = new MiddlewareExecutor<NetworkRequestInfo>();

  constructor(
    state: P2pCellState,
    protected cellId: CellId,
    protected network: Network
  ) {
    this.neighbors = state.neighbors;
    this.redundancyFactor = state.redundancyFactor;
  }

  getState(): P2pCellState {
    return {
      neighbors: this.neighbors,
      redundancyFactor: this.redundancyFactor,
    };
  }

  /** P2p actions */

  async join(containerCell: Cell): Promise<void> {
    const dnaHash = this.cellId[0];
    const agentPubKey = this.cellId[1];

    this.network.bootstrapService.announceCell(this.cellId, containerCell);

    const neighbors = this.network.bootstrapService.getNeighborhood(
      dnaHash,
      agentPubKey,
      this.redundancyFactor
    );

    this.neighbors = neighbors
      .filter(cell => cell.agentPubKey !== agentPubKey)
      .map(cell => cell.agentPubKey);

    const promises = neighbors.map(neighbor =>
      this._executeNetworkRequest(
        neighbor,
        NetworkRequestType.ADD_NEIGHBOR,
        (cell: Cell) => cell.handle_new_neighbor(agentPubKey)
      )
    );
    await Promise.all(promises);
  }

  async leave(): Promise<void> {}

  async publish(dht_hash: Hash, ops: Dictionary<DHTOp>): Promise<void> {
    await this.network.kitsune.rpc_multi(
      this.cellId[0],
      this.cellId[1],
      dht_hash,
      this.redundancyFactor,
      (cell: Cell) =>
        this._executeNetworkRequest(
          cell,
          NetworkRequestType.PUBLISH_REQUEST,
          (cell: Cell) => cell.handle_publish(this.cellId[1], dht_hash, ops)
        )
    );
  }

  async get(dht_hash: Hash, options: GetOptions): Promise<Element | undefined> {
    const gets = await this.network.kitsune.rpc_multi(
      this.cellId[0],
      this.cellId[1],
      dht_hash,
      0,
      (cell: Cell) =>
        this._executeNetworkRequest(
          cell,
          NetworkRequestType.GET_REQUEST,
          (cell: Cell) => cell.handle_get(dht_hash, options)
        )
    );

    const result = gets.find(get => !!get);

    if (!result) return undefined;

    if ((result as GetElementFull).signed_header) {
      return {
        entry: (result as GetElementFull).maybe_entry,
        signed_header: (result as GetElementFull).signed_header,
      };
    } else {
      return {
        signed_header: (result as GetEntryFull).live_headers[0],
        entry: (result as GetEntryFull).entry,
      };
    }
  }

  async call_remote(
    agent: AgentPubKey,
    zome: string,
    fnName: string,
    cap: CapSecret | undefined,
    payload: any
  ): Promise<any> {
    return this.network.kitsune.rpc_single(
      this.cellId[0],
      this.cellId[1],
      agent,
      (cell: Cell) =>
        this._executeNetworkRequest(
          cell,
          NetworkRequestType.CALL_REMOTE,
          (cell: Cell) =>
            cell.handle_call_remote(this.cellId[1], zome, fnName, cap, payload)
        )
    );
  }

  /** Neighbor handling */

  public getNeighbors(): Array<AgentPubKey> {
    return this.neighbors;
  }

  async addNeighbor(neighborPubKey: AgentPubKey) {
    if (
      neighborPubKey !== this.cellId[1] &&
      !this.neighbors.includes(neighborPubKey)
    )
      this.neighbors.push(neighborPubKey);
  }

  private _executeNetworkRequest<T>(
    toCell: Cell,
    type: NetworkRequestType,
    request: NetworkRequest<T>
  ): Promise<T> {
    const networkRequest: NetworkRequestInfo = {
      fromAgent: this.cellId[1],
      toAgent: toCell.agentPubKey,
      dnaHash: this.cellId[0],
      type,
    };

    return this.networkRequestsExecutor.execute(
      () => request(toCell),
      networkRequest
    );
  }
}
