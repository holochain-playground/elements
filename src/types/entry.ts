import { hash } from '../processors/hash';
import { CapClaim, ZomeCallCapGrant } from './capabilities';

export type EntryType = 'Agent' | { App: string } | 'CapClaim' | 'CapGrant';

export interface EntryContent<E extends string, C> {
  entry_type: E;
  content: C;
}

export type Entry =
  | EntryContent<'Agent', string>
  | EntryContent<'App', any>
  | EntryContent<'CapGrant', ZomeCallCapGrant>
  | EntryContent<'CapClaim', CapClaim>;

export async function hashEntry(entry: Entry): Promise<string> {
  if (entry.entry_type === 'Agent') return entry.content;
  return hash(entry);
}
