import {
  Cell,
  CellMap,
  Conductor,
  createConductors,
  SimulatedHappBundle,
  selectSourceChain,
  ConductorSignalType,
  SimulatedDna,
} from '@holochain-playground/core';
import { Element } from '@holochain-open-dev/core-types';
import { CellId } from '@holochain/conductor-api';
import { get, readable, Readable, writable, Writable } from 'svelte/store';

import { PlaygroundMode } from './mode';
import { CellStore, ConductorStore, PlaygroundStore } from './playground-store';
import { cellChanges } from './utils';

export class SimulatedCellStore extends CellStore<PlaygroundMode.Simulated> {
  sourceChain: Writable<Element[]> = writable([]);

  constructor(protected cell: Cell) {
    super();
    cell.workflowExecutor.success(async () => this.update());
  }

  get dna() {
    return this.cell.getSimulatedDna();
  }

  update() {
    const state = this.cell._state;

    this.sourceChain.set(selectSourceChain(state));
  }
}

export class SimulatedConductorStore extends ConductorStore<PlaygroundMode.Simulated> {
  cells: Readable<CellMap<SimulatedCellStore>>;

  constructor(conductor: Conductor) {
    super();

    let cellMap = this.buildStores(conductor, new CellMap());

    this.cells = readable(cellMap, (set) => {
      conductor.addSignalHandler((signal) => {
        if (signal === ConductorSignalType.CellsChanged) {
          cellMap = this.buildStores(conductor, cellMap);
          set(cellMap);
        }
      });
    });
  }

  buildStores(conductor: Conductor, currentCells: CellMap<SimulatedCellStore>) {
    const { cellsToAdd, cellsToRemove } = cellChanges(
      currentCells.cellIds(),
      conductor.cells.cellIds()
    );

    for (const cellId of cellsToAdd) {
      currentCells.put(
        cellId,
        new SimulatedCellStore(conductor.getCell(cellId))
      );
    }
    for (const cellId of cellsToRemove) {
      currentCells.delete(cellId);
    }
    return currentCells;
  }
}

export class SimulatedPlaygroundStore extends PlaygroundStore<PlaygroundMode.Simulated> {
  conductors: Writable<Array<SimulatedConductorStore>>;

  private constructor(initialConductors: Conductor[]) {
    super();
    this.conductors = writable(
      initialConductors.map((c) => new SimulatedConductorStore(c))
    );
    this.activeDna.set(initialConductors[0].cells.cellIds()[0][0]);
  }

  static async create(
    numberOfConductors: number,
    simulatedHapp: SimulatedHappBundle
  ) {
    const initialConductors = await createConductors(
      numberOfConductors,
      [],
      simulatedHapp
    );

    return new SimulatedPlaygroundStore(initialConductors);
  }
}
