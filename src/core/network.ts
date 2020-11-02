import { AgentPubKey, Dictionary } from '../types/common';
import { Element } from '../types/element';
import { CellId } from './cell';
import { P2pCell } from './network/p2p-cell';

export class Network {
  p2pCells: Dictionary<P2pCell>; // Key is the serialized CellId

  public publish(fromCell: CellId, element: Element): Promise<void> {}

  private getPeersForCell(cell: CellId): Array<AgentPubKey> {
    return this.peersByCell[this.getCellKey(cell)];
  }
  private getCellKey(cellId: CellId): string {
    return `${cellId[0]}:${cellId[1]}`;
  }
}
