import { AgentPubKey, Dictionary, Hash } from '../../types/common';
import { DHTOp } from '../../types/dht-op';

// From: https://github.com/holochain/holochain/blob/develop/crates/holochain_p2p/src/types/actor.rs
export class P2pCell {
  peers: Array<AgentPubKey>;
  
  async join(dnaHash: Hash, agent_pub_key: AgentPubKey): Promise<void> {}

  async leave(dnaHash: Hash, agent_pub_key: AgentPubKey): Promise<void> {}

  async publish(
    dnaHash: Hash,
    from_agent: AgentPubKey,
    request_validation_recepit: Boolean,
    dht_hash: Hash,
    ops: Dictionary<DHTOp>,
    timeoutMs: number | undefined
  ): Promise<void> {}
}
