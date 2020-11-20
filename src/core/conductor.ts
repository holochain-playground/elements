import { Cell } from '../core/cell';
import { hash } from '../processors/hash';
import { Network, NetworkState } from './network';
import { CellState } from '../types/cell-state';
import { SimulatedDna } from '../dnas/simulated-dna';
import { CellId } from '../types/common';

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

  static async create(): Promise<Conductor> {
    const state: ConductorState = {
      cellsState: [],
      networkState: {
        p2pCellsState: [],
      },
    };

    return new Conductor(state);
  }

  getState(): ConductorState {
    return {
      networkState: this.network.getState(),
      cellsState: this.cells.map((c) => ({
        id: c.id,
        state: c.cell.getState(),
      })),
    };
  }

  getCells(dnaHash: string): Cell[] {
    return this.cells
      .filter((cell) => cell.id[1] === dnaHash)
      .map((c) => c.cell);
  }

  async installDna(dna: SimulatedDna, membrane_proof: any): Promise<Cell> {
    const rand = Math.random().toString();
    const agentId = hash(rand);

    const cell = await Cell.create(this, dna, agentId, membrane_proof);

    this.cells.push({ id: cell.cellId, cell });

    return cell;
  }

  callZomeFn(args: {
    cellId: CellId;
    zome: string;
    fnName: string;
    payload: any;
    cap: string;
  }): Promise<any> {
    const cell = this.cells.find(
      (cell) => cell.id[0] === args.cellId[0] && cell.id[1] === args.cellId[1]
    );

    if (!cell)
      throw new Error(
        `No cells existst with cellId ${args.cellId[0]}:${args.cellId[1]}`
      );

    return cell.cell.callZomeFn({
      zome: args.zome,
      cap: args.cap,
      fnName: args.fnName,
      payload: args.payload,
    });
  }
}
