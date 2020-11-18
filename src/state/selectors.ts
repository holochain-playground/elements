import { Playground } from './playground';
import { Cell } from '../core/cell';
import { getEntryDetails, isHoldingEntry } from '../core/cell/dht/get';
import { Conductor } from '../core/conductor';
import { AgentPubKey, Hash } from '../types/common';
import { NewEntryHeader } from '../types/header';

export const selectCellCount = (state: Playground) =>
  selectActiveCells(state).length;

export const selectActiveCells = (state: Playground): Cell[] => {
  const cells: Cell[][] = state.conductors.map((c) =>
    c.cells
      .filter((cell) => cell.cell.dnaHash === state.activeDNA)
      .map((c) => c.cell)
  );
  return [].concat(...cells);
};

export const selectGlobalDHTOps = (state: Playground) => {
  let dhtOps = 0;

  for (const cell of selectActiveCells(state)) {
    dhtOps += Object.keys(cell.state.integratedDHTOps).length;
  }

  return dhtOps;
};

export const selectHoldingCells = (state: Playground) => (entryHash: string) =>
  selectActiveCells(state).filter((cell) =>
    isHoldingEntry(cell.state, entryHash)
  );

export const selectActiveConductor = (state: Playground) =>
  state.activeAgentId
    ? state.conductors.find((conductor) =>
        conductor.cells.find(
          (cell) => cell.cell.agentPubKey === state.activeAgentId
        )
      )
    : undefined;

export const selectActiveCell = (state: Playground) => {
  const conductor = selectActiveConductor(state);

  if (!conductor) return undefined;

  const cell = Object.values(conductor.cells).find(
    (cell) =>
      cell.cell.agentPubKey === state.activeAgentId &&
      cell.cell.dnaHash == state.activeDNA
  );

  return cell ? cell.cell : undefined;
};

export const selectUniqueDHTOps = (state: Playground) => {
  const globalDHTOps = {};

  for (const cell of selectActiveCells(state)) {
    for (const hash of Object.keys(cell.state.integratedDHTOps)) {
      globalDHTOps[hash] = {};
    }
  }

  return Object.keys(globalDHTOps).length;
};

export const selectEntryDetails = (state: Playground) => (
  entryHash: string
) => {
  if (!state.activeDNA) return undefined;
  for (const conductor of state.conductors) {
    const cell = conductor.cells.find(
      (c) => c.cell.dnaHash === state.activeDNA
    );
    if (cell) {
      const details = getEntryDetails(cell.cell.state, entryHash);

      if (details) {
        return details;
      }
    }
  }
  return undefined;
};

export const selectActiveCellsForConductor = (state: Playground) => (
  conductor: Conductor
) => conductor.cells.filter((c) => c.cell.dnaHash === state.activeDNA);

export const selectActiveEntry = (state: Playground) => {
  if (!state.activeEntryId) return undefined;
  return selectEntry(state)(state.activeEntryId);
};

export const selectEntry = (state: Playground) => (entryHash: string) => {
  if (!state.activeDNA) return undefined;
  for (const conductor of state.conductors) {
    const cell = selectActiveCellsForConductor(state)(conductor);
    const entry = cell[0].cell.state.CAS[entryHash];
    if (entry) {
      return entry;
    }
  }
  return undefined;
};

export const selectHeader = (state: Playground) => (headerHash: string) => {
  if (!state.activeDNA) return undefined;
  for (const conductor of state.conductors) {
    const cell = selectActiveCellsForConductor(state)(conductor);
    const entry = cell[0].cell.state.CAS[headerHash];
    if (entry) {
      return entry;
    }
  }
  return undefined;
};

export const selectHeaderEntry = (state: Playground) => (
  headerHash: string
) => {
  if (!state.activeDNA) return undefined;
  for (const conductor of state.conductors) {
    const cell = selectActiveCellsForConductor(state)(conductor);
    const header = cell[0].cell.state.CAS[headerHash];
    if (header && (header as NewEntryHeader).entry_hash) {
      const entry =
        cell[0].cell.state.CAS[(header as NewEntryHeader).entry_hash];
      return entry;
    }
  }
  return undefined;
};

export const selectMedianHoldingDHTOps = (state: Playground) => {
  const holdingDHTOps = [];

  for (const cell of selectActiveCells(state)) {
    holdingDHTOps.push(Object.keys(cell.state.integratedDHTOps).length);
  }

  holdingDHTOps.sort();

  const medianIndex = Math.floor(holdingDHTOps.length / 2);

  return holdingDHTOps.sort((a, b) => a - b)[medianIndex];
};

export const selectAllDNAs = (state: Playground) => {
  const dnas = {};

  for (const conductor of state.conductors) {
    for (const cell of Object.values(conductor.cells)) {
      dnas[cell.cell.dnaHash] = true;
    }
  }
  return Object.keys(dnas);
};

export const selectCell = (state: Playground) => (
  dnaHash: Hash,
  agentId: AgentPubKey
) => {
  for (const conductor of state.conductors) {
    for (const cell of conductor.cells) {
      if (cell.cell.agentPubKey === agentId && cell.cell.dnaHash === dnaHash) {
        return cell.cell;
      }
    }
  }

  return undefined;
};

export const selectRedundancyFactor = (state: Playground) => {
  const cells = selectActiveCells(state);
  return cells[0].p2p.redundancyFactor;
};
