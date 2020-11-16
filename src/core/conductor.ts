import { Cell, CellId } from '../core/cell';
import { hash } from '../processors/hash';
import { Network, NetworkState } from './network';
import { CellState } from '../types/cell-state';
import { SimulatedDna } from '../dnas/simulated-dna';

export interface ConductorState {
  cellsState: Array<{ id: CellId; state: CellState; dna?: SimulatedDna }>;
  networkState: NetworkState;
}

export class Conductor {
  readonly cells: Array<{ id: CellId; cell: Cell }>;
  network: Network;

  constructor(state: ConductorState) {
    this.network = new Network(state.networkState);
    this.cells = state.cellsState.map(({ id, state, dna }) => ({
      id,
      cell: new Cell(state, this.network.createP2pCell(id), dna),
    }));
  }

  static async new(): Promise<Conductor> {
    const state: ConductorState = {
      cellsState: [],
      networkState: {
        p2pCellsState: [],
      },
    };

    return new Conductor(state);
  }

  async installDna(dna: SimulatedDna, membrane_proof: any): Promise<Cell> {
    const rand = Math.random().toString();
    const agentId = await hash(rand);

    const cell = await Cell.create(this, dna, agentId, membrane_proof);

    this.cells.push({ id: cell.cellId, cell });

    return cell;
  }
}
