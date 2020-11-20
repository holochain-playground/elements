import '../_setToArray-0c1e9efa.js';
import { isHoldingEntry, getEntryDetails } from '../core/cell/dht/get.js';
import '../types/metadata.js';

const selectCellCount = (state) => selectActiveCells(state).length;
const selectActiveCells = (state) => {
    const cells = state.conductors.map((c) => c.cells
        .filter((cell) => cell.cell.dnaHash === state.activeDNA)
        .map((c) => c.cell));
    return [].concat(...cells);
};
const selectGlobalDHTOps = (state) => {
    let dhtOps = 0;
    for (const cell of selectActiveCells(state)) {
        dhtOps += Object.keys(cell.state.integratedDHTOps).length;
    }
    return dhtOps;
};
const selectHoldingCells = (state) => (entryHash) => selectActiveCells(state).filter((cell) => isHoldingEntry(cell.state, entryHash));
const selectActiveConductor = (state) => state.activeAgentId
    ? state.conductors.find((conductor) => conductor.cells.find((cell) => cell.cell.agentPubKey === state.activeAgentId))
    : undefined;
const selectActiveCell = (state) => {
    const conductor = selectActiveConductor(state);
    if (!conductor)
        return undefined;
    const cell = Object.values(conductor.cells).find((cell) => cell.cell.agentPubKey === state.activeAgentId &&
        cell.cell.dnaHash == state.activeDNA);
    return cell ? cell.cell : undefined;
};
const selectUniqueDHTOps = (state) => {
    const globalDHTOps = {};
    for (const cell of selectActiveCells(state)) {
        for (const hash of Object.keys(cell.state.integratedDHTOps)) {
            globalDHTOps[hash] = {};
        }
    }
    return Object.keys(globalDHTOps).length;
};
const selectEntryDetails = (state) => (entryHash) => {
    if (!state.activeDNA)
        return undefined;
    for (const conductor of state.conductors) {
        const cell = conductor.cells.find((c) => c.cell.dnaHash === state.activeDNA);
        if (cell) {
            const details = getEntryDetails(cell.cell.state, entryHash);
            if (details) {
                return details;
            }
        }
    }
    return undefined;
};
const selectActiveCellsForConductor = (state) => (conductor) => conductor.cells
    .filter((c) => c.cell.dnaHash === state.activeDNA)
    .map((c) => c.cell);
const selectActiveEntry = (state) => {
    if (!state.activeEntryId)
        return undefined;
    return selectEntry(state)(state.activeEntryId);
};
const selectEntry = (state) => (entryHash) => {
    if (!state.activeDNA)
        return undefined;
    for (const conductor of state.conductors) {
        const cell = selectActiveCellsForConductor(state)(conductor);
        const entry = cell[0].state.CAS[entryHash];
        if (entry) {
            return entry;
        }
    }
    return undefined;
};
const selectHeader = (state) => (headerHash) => {
    if (!state.activeDNA)
        return undefined;
    for (const conductor of state.conductors) {
        const cell = selectActiveCellsForConductor(state)(conductor);
        const entry = cell[0].state.CAS[headerHash];
        if (entry) {
            return entry;
        }
    }
    return undefined;
};
const selectHeaderEntry = (state) => (headerHash) => {
    if (!state.activeDNA)
        return undefined;
    for (const conductor of state.conductors) {
        const cell = selectActiveCellsForConductor(state)(conductor);
        const header = cell[0].state.CAS[headerHash];
        if (header && header.entry_hash) {
            const entry = cell[0].state.CAS[header.entry_hash];
            return entry;
        }
    }
    return undefined;
};
const selectMedianHoldingDHTOps = (state) => {
    const holdingDHTOps = [];
    for (const cell of selectActiveCells(state)) {
        holdingDHTOps.push(Object.keys(cell.state.integratedDHTOps).length);
    }
    holdingDHTOps.sort();
    const medianIndex = Math.floor(holdingDHTOps.length / 2);
    return holdingDHTOps.sort((a, b) => a - b)[medianIndex];
};
const selectAllDNAs = (state) => {
    const dnas = {};
    for (const conductor of state.conductors) {
        for (const cell of Object.values(conductor.cells)) {
            dnas[cell.cell.dnaHash] = true;
        }
    }
    return Object.keys(dnas);
};
const selectCell = (state) => (dnaHash, agentId) => {
    for (const conductor of state.conductors) {
        for (const cell of conductor.cells) {
            if (cell.cell.agentPubKey === agentId && cell.cell.dnaHash === dnaHash) {
                return cell.cell;
            }
        }
    }
    return undefined;
};
const selectRedundancyFactor = (state) => {
    const cells = selectActiveCells(state);
    return cells[0].p2p.redundancyFactor;
};

export { selectActiveCell, selectActiveCells, selectActiveCellsForConductor, selectActiveConductor, selectActiveEntry, selectAllDNAs, selectCell, selectCellCount, selectEntry, selectEntryDetails, selectGlobalDHTOps, selectHeader, selectHeaderEntry, selectHoldingCells, selectMedianHoldingDHTOps, selectRedundancyFactor, selectUniqueDHTOps };
//# sourceMappingURL=selectors.js.map
