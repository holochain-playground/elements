import {
  Hash,
  AgentPubKey,
  SignedHeaderHashed,
  NewEntryHeader,
} from '@holochain-open-dev/core-types';
import { serializeHash, deserializeHash } from '@holochain-open-dev/common';
import { Conductor, Cell, CellState } from '@holochain-playground/core';
import { isEqual } from 'lodash-es';

export function selectCells(dna: Hash, conductor: Conductor): Cell[] {
  return conductor.cells
    .filter((cell) => isEqual(cell.cell.dnaHash, dna))
    .map((c) => c.cell);
}

export function selectAllCells(dna: Hash, conductors: Conductor[]): Cell[] {
  const cells = conductors.map((c) => selectCells(dna, c));
  return [].concat(...cells);
}

export function selectGlobalDHTOpsCount(cells: Cell[]): number {
  let dhtOps = 0;

  for (const cell of cells) {
    dhtOps += Object.keys(cell.state.integratedDHTOps).length;
  }

  return dhtOps;
}

export function selectHoldingCells(entryHash: Hash, cells: Cell[]): Cell[] {
  return cells.filter((cell) => isHoldingEntry(cell.state, entryHash));
}

export function isHoldingEntry(state: CellState, entryHash: Hash) {
  for (const integratedDhtOpValue of Object.values(state.integratedDHTOps)) {
    const holdedEntryHash = (integratedDhtOpValue.op.header.header
      .content as NewEntryHeader).entry_hash;
    if (holdedEntryHash && isEqual(holdedEntryHash, entryHash)) {
      return true;
    }
  }

  for (const authoredDhtOpsValue of Object.values(state.authoredDHTOps)) {
    const holdedEntryHash = (authoredDhtOpsValue.op.header.header
      .content as NewEntryHeader).entry_hash;
    if (holdedEntryHash && isEqual(holdedEntryHash, entryHash)) {
      return true;
    }
  }

  return false;
}

export function selectConductorByAgent(
  agentPubKey: AgentPubKey,
  conductors: Conductor[]
): Conductor | undefined {
  return conductors.find((conductor) =>
    conductor.cells.find((cell) => isEqual(cell.cell.agentPubKey, agentPubKey))
  );
}

export function selectCell(
  dnaHash: Hash,
  agentPubKey: AgentPubKey,
  conductors: Conductor[]
): Cell | undefined {
  const conductor = selectConductorByAgent(agentPubKey, conductors);

  if (!conductor) return undefined;

  const cell = conductor.cells.find(
    (cell) =>
      isEqual(cell.cell.agentPubKey, agentPubKey) &&
      isEqual(cell.cell.dnaHash, dnaHash)
  );

  return cell ? cell.cell : undefined;
}

export function selectUniqueDHTOpsCount(cells: Cell[]): number {
  const globalDHTOps = {};

  for (const cell of cells) {
    for (const hash of Object.keys(cell.state.integratedDHTOps)) {
      globalDHTOps[hash] = {};
    }
  }

  return Object.keys(globalDHTOps).length;
}

export function selectFromCAS(hash: Hash, cells: Cell[]): any {
  for (const cell of cells) {
    const entry = cell.state.CAS[serializeHash(hash)];
    if (entry) {
      return entry;
    }
  }
  return undefined;
}

export function selectHeaderEntry(headerHash: Hash, cells: Cell[]): any {
  const header: SignedHeaderHashed<NewEntryHeader> = selectFromCAS(
    headerHash,
    cells
  );
  return selectFromCAS(header.header.content.entry_hash, cells);
}

export function selectMedianHoldingDHTOps(cells: Cell[]): number {
  const holdingDHTOps = [];

  for (const cell of cells) {
    holdingDHTOps.push(Object.keys(cell.state.integratedDHTOps).length);
  }

  holdingDHTOps.sort();

  const medianIndex = Math.floor(holdingDHTOps.length / 2);

  return holdingDHTOps.sort((a, b) => a - b)[medianIndex];
}

export function selectAllDNAs(conductors: Conductor[]): Hash[] {
  const dnas = {};

  for (const conductor of conductors) {
    for (const cell of Object.values(conductor.cells)) {
      dnas[serializeHash(cell.cell.dnaHash)] = true;
    }
  }
  return Object.keys(dnas).map(deserializeHash);
}

export function selectRedundancyFactor(cell: Cell): number {
  return cell.p2p.redundancyFactor;
}
