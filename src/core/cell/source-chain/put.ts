import { hash } from '../../../processors/hash';
import { CellState } from '../../../types/cell-state';
import { Element } from '../../../types/element';

export const putElement = (element: Element) => (state: CellState): void => {
  // Put header in CAS
  const headerHash = hash(element.header);
  state.CAS[headerHash] = element.header;

  // Put entry in CAS if it exist
  if (element.maybe_entry) {
    const entryHash = hash(element.maybe_entry);
    state.CAS[entryHash] = element.maybe_entry;
  }

  state.sourceChain.unshift(headerHash);
};
