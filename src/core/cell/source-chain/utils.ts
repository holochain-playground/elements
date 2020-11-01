import { CellState } from '../../../types/cell-state';
import { AgentPubKey, Hash } from '../../../types/common';
import { Header, HeaderType } from '../../../types/header';
import { Element } from '../../../types/element';

export function getTipOfChain(cellState: CellState): string {
  return cellState.sourceChain[0];
}

export function getAuthor(cellState: CellState): AgentPubKey {
  return getHeaderAt(cellState, 0).author;
}

export function getHeaderAt(cellState: CellState, index: number): Header {
  const headerHash = cellState.sourceChain[index];
  return cellState.CAS[headerHash];
}

export function getNextHeaderSeq(cellState: CellState): number {
  return cellState.sourceChain.length;
}

export function getElement(state: CellState, headerHash: Hash): Element {
  const header: Header = state.CAS[headerHash];

  let maybe_entry = undefined;
  if (header.type == HeaderType.Create || header.type == HeaderType.Update) {
    maybe_entry = state.CAS[header.entry_hash];
  }
  return { header, maybe_entry };
}
