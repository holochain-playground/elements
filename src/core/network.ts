import { AgentPubKey, Dictionary } from '../types/common';
import { Element } from '../types/element';
import { Cell, CellId } from './cell';
import { P2pCell } from './network/p2p-cell';

export class Network {
  p2pCells: Dictionary<P2pCell>; // Key is the serialized CellId

  private getCellKey(cellId: CellId): string {
    return `${cellId[0]}:${cellId[1]}`;
  }
}

export type NetworkMessage<T> = (cell: Cell) => Promise<T>;
