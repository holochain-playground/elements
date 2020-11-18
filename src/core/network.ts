import { CellId, Dictionary, Hash } from '../types/common';
import { Cell } from './cell';
import { Conductor } from './conductor';
import { P2pCell, P2pCellState } from './network/p2p-cell';

export interface NetworkState {
  p2pCellsState: Array<{ id: CellId; state: P2pCellState }>; // P2pCellState by dna hash
}

export class Network {
  // P2pCells contained in this conductor
  p2pCells: Array<{ id: CellId; p2pCell: P2pCell }>;

  // Cell connection segmentated by [dna][agent_pub_key]
  peerCells: Dictionary<Dictionary<Cell>>;

  constructor(state: NetworkState) {
    this.p2pCells = state.p2pCellsState.map((s) => ({
      id: s.id,
      p2pCell: new P2pCell(s.state, s.id, this),
    }));
    this.peerCells = {};
  }

  getState(): NetworkState {
    return {
      p2pCellsState: this.p2pCells.map((c) => ({
        id: c.id,
        state: c.p2pCell.getState(),
      })),
    };
  }

  // TODO: change this to simulate networking if necessary
  connectWith(conductor: Conductor) {
    for (const myCells of this.p2pCells) {
      const cellDna = myCells.id[1];
      for (const cell of conductor.cells) {
        if (cell.id[1] === cellDna) {
          if (!this.peerCells[cellDna]) this.peerCells[cellDna] = {};
          this.peerCells[cellDna][cell.id[0]] = cell.cell;
        }
      }
    }
  }

  createP2pCell(cellId: CellId): P2pCell {
    const peersOfTheSameDna = this.peerCells[cellId[1]];
    const peersAlreadyKnown = peersOfTheSameDna
      ? Object.keys(peersOfTheSameDna)
      : [];

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
    return message(this.peerCells[dna][toAgent]);
  }
}

export type NetworkMessage<T> = (cell: Cell) => Promise<T>;
