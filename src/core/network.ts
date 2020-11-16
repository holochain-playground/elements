import { Dictionary, Hash } from '../types/common';
import { Cell, CellId } from './cell';
import { Conductor } from './conductor';
import { P2pCell, P2pCellState } from './network/p2p-cell';

export interface NetworkState {
  p2pCellsState: Array<{ id: CellId; state: P2pCellState }>; // P2pCellState by dna hash
}

export class Network {
  p2pCells: Array<{ id: CellId; p2pCell: P2pCell }>; // Cell connection segmentated by [dna][agent_pub_key]
  peerCells: Dictionary<Dictionary<Cell>>; // Cell connection segmentated by [dna][agent_pub_key]

  constructor(state: NetworkState) {
    this.p2pCells = state.p2pCellsState.map((s) => ({
      id: s.id,
      p2pCell: new P2pCell(s.state, s.id, this),
    }));
  }

  connectWith(dnaHash: Hash, conductor: Conductor) {
    for (const cell of conductor.cells) {
      if (cell.id[1] === dnaHash) {
        this.peerCells[dnaHash][cell.id[0]] = cell.cell;
      }
    }
  }

  createP2pCell(cellId: CellId): P2pCell {
    const peersOfTheSameDna = this.peerCells[cellId[1]];
    const peersAlreadyKnown = peersOfTheSameDna
      ? Object.keys(peersOfTheSameDna)
      : undefined;

    const state: P2pCellState = {
      peers: peersAlreadyKnown,
      redundancyFactor: 3,
    };

    const p2pCell = new P2pCell(state, cellId, this);

    this.p2pCells.push({ id: cellId, p2pCell });

    return p2pCell;
  }

  public sendMessage<T>(
    dna: Hash,
    fromAgent: Hash,
    toAgent: Hash,
    message: NetworkMessage<T>
  ): Promise<T> {
    return message(this.peerCells[dna][toAgent])
  }
}

export type NetworkMessage<T> = (cell: Cell) => Promise<T>;
