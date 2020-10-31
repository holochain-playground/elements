export type Dictionary<T> = {
  [key: string]: T;
};

export type Hash = string;
export type AgentPubKey = string;
export type Timestamp = [number, number];

export type EntryVisibility = string;
export type AppEntryType = {
  id: number;
  zome_id: number;
  visibility: EntryVisibility;
};
export type EntryType = AgentPubKey | AppEntryType | 'CapClaim' | 'CapGrant';
