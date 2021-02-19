import { Entry, Hash } from '@holochain-open-dev/core-types';
import { Cell, hashEntry } from '../../cell';
import { HostFn, HostFnWorkspace } from '../host-fn';

export type HashEntry = (args: { content: any }) => Promise<Hash>;

// Creates a new Create header and its entry in the source chain
export const hash_entry: HostFn<HashEntry> = (
  worskpace: HostFnWorkspace
): HashEntry => async (args): Promise<Hash> => {
  const entry: Entry = { entry_type: 'App', content: args.content };
  return hashEntry(entry);
};
