import { CellState } from '../../../types/cell-state';
import { AgentPubKey, Dictionary, Hash } from '../../../types/common';
import { Dna, Header, HeaderType } from '../../../types/header';
import { Element } from '../../../types/element';
import { CellId } from '../../cell';
import { DHTOp } from '../../../types/dht-op';

export function getTipOfChain(cellState: CellState): string {
  return cellState.sourceChain[0];
}

export function getAuthor(cellState: CellState): AgentPubKey {
  return getHeaderAt(cellState, 0).author;
}

export function getDnaHash(state: CellState): Hash {
  const firstHeaderHash = state.sourceChain[state.sourceChain.length - 1];

  const dna: Dna = state.CAS[firstHeaderHash];
  return dna.hash;
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

export function getCellId(state: CellState): CellId {
  const author = getAuthor(state);
  const dna = getDnaHash(state);
  return [author, dna];
}

export function getNonPublishedDhtOps(state: CellState): Dictionary<DHTOp> {
  const nonPublishedDhtOps = {};
  for (const dhtOpHash of Object.keys(state.authoredDHTOps)) {
    const authoredValue = state.authoredDHTOps[dhtOpHash];
    if (authoredValue.last_publish_time === undefined) {
      nonPublishedDhtOps[dhtOpHash] = authoredValue.op;
    }
  }

  return nonPublishedDhtOps;
}
