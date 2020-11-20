import { AgentPubKey } from './common';

export type CapSecret = string;

export interface CapClaim {
  tag: string;
  grantor: AgentPubKey;
  secret: CapSecret;
}

export interface ZomeCallCapGrant {
  tag: string;
  access: string; // TODO implement CapAccesshttps://github.com/holochain/holochain/blob/6b47b136bc419be6e85000a08a59f67b4c46226c/crates/zome_types/src/capability/grant.rs
  functions: string[];
}

export type CapGrant =
  | {
      ChainAuthor: AgentPubKey;
    }
  | {
      RemoteAgent: ZomeCallCapGrant;
    };
