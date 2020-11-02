import { compareBigInts, distance } from '../../processors/hash';
import { AgentPubKey, Dictionary, Hash } from '../../types/common';
import { DHTOp } from '../../types/dht-op';
import { CellId } from '../cell';
import { Conductor } from '../conductor';
import { NetworkMessage } from '../network';

// From: https://github.com/holochain/holochain/blob/develop/crates/holochain_p2p/src/types/actor.rs
export class P2pCell {
  constructor(
    protected conductor: Conductor,
    protected cellId: CellId,
    protected peers: Array<AgentPubKey> = [],
    protected redundancyFactor: number = 3
  ) {}

  async join(dnaHash: Hash, agent_pub_key: AgentPubKey): Promise<void> {}

  async leave(dnaHash: Hash, agent_pub_key: AgentPubKey): Promise<void> {}

  async publish(dht_hash: Hash, ops: Dictionary<DHTOp>): Promise<void> {
    const neighbors = this._getClosestNeighbors(
      dht_hash,
      this.redundancyFactor
    );

    const promises = neighbors.map((neighbor) =>
      this._sendMessage(neighbor, (cell) =>
        cell.handle_publish(this.cellId[0], dht_hash, ops)
      )
    );

    await Promise.all(promises);
  }

  async get(
    dna_hash: Hash,
    from_agent: AgentPubKey,
    dht_hash: Hash,
    _options: any // TODO: complete?
  ): Promise<Element | undefined> {
    return undefined;
  }

  private _getClosestNeighbors(
    basisHash: Hash,
    neighborCount: number
  ): Array<AgentPubKey> {
    const sortedPeers = [this.cellId[0], ...this.peers].sort(
      (agentA: string, agentB: string) => {
        const distanceA = distance(basisHash, agentA);
        const distanceB = distance(basisHash, agentB);
        return compareBigInts(distanceA, distanceB);
      }
    );

    return sortedPeers.slice(0, neighborCount);
  }

  private _sendMessage<T>(
    toAgent: AgentPubKey,
    message: NetworkMessage<T>
  ): Promise<T> {
    const agentId = this.peers.find((agent) => agent === toAgent);

    if (!agentId) throw new Error('Agent was not found');

    return this.conductor.sendMessage(
      this.cellId[1],
      this.cellId[0],
      agentId,
      message
    );
  }
}
