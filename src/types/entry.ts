import { hash } from '../processors/hash';
import { CapClaim, ZomeCallCapGrant } from './capabilities';

export enum EntryType {
  Agent = 'Agent',
  App = 'App',
  CapClaim = 'CapTokenGrant',
  CapGrant = 'CapTokenClaim',
}

export interface EntryContent<E extends EntryType, C> {
  entry_type: E;
  content: C;
}

export type Entry =
  | EntryContent<EntryType.Agent, string>
  | EntryContent<EntryType.App, any>
  | EntryContent<EntryType.CapGrant, ZomeCallCapGrant>
  | EntryContent<EntryType.CapClaim, CapClaim>;

export async function hashEntry(entry: Entry): Promise<string> {
  if (entry.entry_type === EntryType.Agent) return entry.content;
  return hash(entry);
}
