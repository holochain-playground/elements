import {
  Cell,
  CellMap,
  Conductor,
  createConductors,
  SimulatedHappBundle,
  selectSourceChain,
  ConductorSignalType,
  selectDhtShard,
  SimulatedDna,
  BadAgent,
} from '@holochain-playground/core';
import { Element } from '@holochain-open-dev/core-types';
import { AgentPubKey, CellId, DhtOp } from '@holochain/conductor-api';
import {
  derived,
  get,
  readable,
  Readable,
  writable,
  Writable,
} from 'svelte/store';

import { PlaygroundMode } from './mode';
import { CellStore, ConductorStore, PlaygroundStore } from './playground-store';
import { cellChanges } from './utils';

export class SimulatedCellStore extends CellStore<PlaygroundMode.Simulated> {
  sourceChain: Writable<Element[]> = writable([]);
  peers: Writable<AgentPubKey[]> = writable([]);
  dhtShard: Writable<DhtOp[]> = writable([]);

  badAgents: Writable<AgentPubKey[]> = writable([]);
  farPeers: Writable<AgentPubKey[]> = writable([]);

  constructor(
    public cell: Cell,
    public conductorStore: SimulatedConductorStore
  ) {
    super();
    cell.workflowExecutor.success(async () => this.update());
  }

  get dna() {
    return this.cell.getSimulatedDna();
  }

  get cellId() {
    return this.cell.cellId;
  }

  update() {
    const state = this.cell._state;
    const p2pstate = this.cell.p2p.getState();

    this.sourceChain.set(selectSourceChain(state));
    this.peers.set(p2pstate.neighbors);
    this.dhtShard.set(selectDhtShard(state));
    this.badAgents.set(p2pstate.badAgents);
    this.farPeers.set(p2pstate.farKnownPeers);
  }
}

export class SimulatedConductorStore extends ConductorStore<PlaygroundMode.Simulated> {
  cells: Readable<CellMap<SimulatedCellStore>>;
  badAgent: Readable<BadAgent>;

  constructor(protected conductor: Conductor) {
    super();

    let cellMap = this.buildStores(conductor, new CellMap());

    this.cells = readable(cellMap, (set) => {
      const { unsubscribe } = conductor.addSignalHandler((signal) => {
        if (signal === ConductorSignalType.CellsChanged) {
          cellMap = this.buildStores(conductor, cellMap);
          set(cellMap);
        }
      });
      return () => {
        unsubscribe();
      };
    });
    this.badAgent = readable(this.conductor.badAgent);
  }

  get name() {
    return this.conductor.name;
  }

  buildStores(conductor: Conductor, currentCells: CellMap<SimulatedCellStore>) {
    const { cellsToAdd, cellsToRemove } = cellChanges(
      currentCells.cellIds(),
      conductor.cells.cellIds()
    );

    for (const cellId of cellsToAdd) {
      currentCells.put(
        cellId,
        new SimulatedCellStore(conductor.getCell(cellId), this)
      );
    }
    for (const cellId of cellsToRemove) {
      currentCells.delete(cellId);
    }
    return currentCells;
  }
}

export function pauseStore() {
  const { subscribe, set } = writable(false);

  let _awaitResume = Promise.resolve();
  let awaitResolve = undefined;

  return {
    subscribe,
    pause: () => {
      _awaitResume = new Promise((r) => (awaitResolve = r));
      set(true);
    },
    awaitResume() {
      return _awaitResume;
    },
    resume: () => {
      set(false);
      if (awaitResolve) awaitResolve();
    },
  };
}

export class SimulatedPlaygroundStore extends PlaygroundStore<PlaygroundMode.Simulated> {
  conductors: Writable<Array<SimulatedConductorStore>>;

  paused = pauseStore();

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
