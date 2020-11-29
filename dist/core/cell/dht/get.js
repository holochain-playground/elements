import { getSysMetaValHeaderHash } from '../../../types/metadata.js';
import { uniq } from 'lodash-es';

function getValidationLimboDhtOps(state, status) {
    const pendingDhtOps = {};
    for (const dhtOpHash of Object.keys(state.validationLimbo)) {
        const limboValue = state.validationLimbo[dhtOpHash];
        if (limboValue.status === status) {
            pendingDhtOps[dhtOpHash] = limboValue;
        }
    }
    return pendingDhtOps;
}
function pullAllIntegrationLimboDhtOps(state) {
    const dhtOps = state.integrationLimbo;
    state.integrationLimbo = {};
    return dhtOps;
}
function getHeadersForEntry(state, entryHash) {
    return state.metadata.system_meta[entryHash].map((h) => state.CAS[getSysMetaValHeaderHash(h)]);
}
function getLinksForEntry(state, entryHash) {
    return state.metadata.link_meta
        .filter(({ key, value }) => (key.base = entryHash))
        .map(({ key, value }) => value);
}
function getEntryDhtStatus(state, entryHash) {
    const meta = state.metadata.misc_meta[entryHash];
    return meta
        ? meta.EntryStatus
        : undefined;
}
function getEntryDetails(state, entryHash) {
    const headers = getHeadersForEntry(state, entryHash);
    const links = getLinksForEntry(state, entryHash);
    const dhtStatus = getEntryDhtStatus(state, entryHash);
    return {
        headers: headers,
        links,
        dhtStatus,
    };
}
function getAllHeldEntries(state) {
    const allHeaders = Object.values(state.integratedDHTOps).map((dhtOpValue) => dhtOpValue.op.header);
    const newEntryHeaders = allHeaders.filter((h) => h.entry_hash);
    const allEntryHashes = newEntryHeaders.map((h) => h.entry_hash);
    return uniq(allEntryHashes);
}
function isHoldingEntry(state, entryHash) {
    return state.metadata.system_meta[entryHash] !== undefined;
}
function getDhtShard(state) {
    const heldEntries = getAllHeldEntries(state);
    const dhtShard = {};
    for (const entryHash of heldEntries) {
        dhtShard[entryHash] = getEntryDetails(state, entryHash);
    }
    return dhtShard;
}

export { getAllHeldEntries, getDhtShard, getEntryDetails, getEntryDhtStatus, getHeadersForEntry, getLinksForEntry, getValidationLimboDhtOps, isHoldingEntry, pullAllIntegrationLimboDhtOps };
//# sourceMappingURL=get.js.map
