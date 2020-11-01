import { hash } from '../../../processors/hash';
import { CellState } from '../../../types/cell-state';
import { Entry, EntryType } from '../../../types/entry';
import { Element } from '../../../types/element';
import { buildCreate } from './builder-headers';

export type HdkAction = (state: CellState) => Promise<void>;

// Creates a new Create header and its entry in the source chain
export const create = (
  entry: Entry,
  entry_type: EntryType
): HdkAction => async (state: CellState): Promise<void> => {
  const create = await buildCreate(state, entry, entry_type);

  const element: Element = {
    header: create,
    maybe_entry: entry,
  };

  await putElement(element)(state);
};

export const putElement = (element: Element) => async (
  state: CellState
): Promise<void> => {
  // Put header in CAS
  const headerHash = await hash(element.header);
  state.CAS[headerHash] = element.header;

  // Put entry in CAS if it exist
  if (element.maybe_entry) {
    const entryHash = await hash(element.maybe_entry);
    state.CAS[entryHash] = element.maybe_entry;
  }

  state.sourceChain.unshift(headerHash);
};
