import { getEntryTypeString, getAllHeldEntries, getEntryDetails, getLinksForEntry, getAppEntryType } from '@holochain-playground/core';
import { EntryDhtStatus } from '@holochain-open-dev/core-types';
import { timestampToMillis } from '@holochain-open-dev/common';
import { shortenStrRec } from '../elements/utils/hash.js';

function sourceChainNodes(cell) {
    if (!cell)
        return [];
    const nodes = [];
    const headersHashes = cell.state.sourceChain;
    for (const headerHash of headersHashes) {
        const strHeaderHash = headerHash;
        const header = cell.state.CAS[strHeaderHash];
        nodes.push({
            data: {
                id: strHeaderHash,
                data: header,
                label: header.header.content.type,
            },
            classes: ['header', header.header.content.type],
        });
        if (header.header.content.prev_header) {
            const strPreviousHeaderHash = header.header.content
                .prev_header;
            nodes.push({
                data: {
                    id: `${strHeaderHash}->${strPreviousHeaderHash}`,
                    source: strHeaderHash,
                    target: strPreviousHeaderHash,
                },
            });
        }
    }
    for (const headerHash of headersHashes) {
        const strHeaderHash = headerHash;
        const header = cell.state.CAS[strHeaderHash];
        if (header.header.content.entry_hash) {
            const newEntryHeader = header.header.content;
            const strEntryHash = newEntryHeader.entry_hash;
            const entryNodeId = `${strHeaderHash}:${strEntryHash}`;
            const entry = cell.state.CAS[strEntryHash];
            const entryType = getEntryTypeString(cell, newEntryHeader.entry_type);
            nodes.push({
                data: {
                    id: entryNodeId,
                    data: entry,
                    label: entryType,
                },
                classes: [entryType],
            });
            nodes.push({
                data: {
                    id: `${strHeaderHash}->${entryNodeId}`,
                    source: strHeaderHash,
                    target: entryNodeId,
                },
            });
        }
    }
    return nodes;
}
function allEntries(cells, showEntryContents, excludedEntryTypes) {
    const details = {};
    const links = {};
    const entryTypes = {};
    for (const cell of cells) {
        for (const entryHash of getAllHeldEntries(cell.state)) {
            details[entryHash] = getEntryDetails(cell.state, entryHash);
            links[entryHash] = getLinksForEntry(cell.state, entryHash);
            const firstEntryHeader = details[entryHash].headers[0];
            if (firstEntryHeader &&
                firstEntryHeader.header.content.entry_type) {
                entryTypes[entryHash] = getEntryTypeString(cell, firstEntryHeader.header.content.entry_type);
            }
        }
    }
    //  const agentPubKeys = Object.keys(entries).filter(entryHash => details[entryHash].headers.includes(h=> (h as Agent)));
    const sortedEntries = sortEntries(Object.keys(details), details);
    const linksEdges = [];
    const entryNodes = [];
    const entryTypeCount = {};
    for (const entryHash of sortedEntries) {
        const detail = details[entryHash];
        const entry = detail.entry;
        // Get base nodes and edges
        const newEntryHeader = detail
            .headers[0];
        const entryType = entryTypes[entryHash];
        if (!entryTypeCount[entryType])
            entryTypeCount[entryType] = 0;
        if (!excludedEntryTypes.includes(entryType)) {
            entryNodes.push({
                data: {
                    id: entryHash,
                    data: entry,
                    label: `${entryType}${entryTypeCount[entryType]}`,
                },
                classes: [entryType],
            });
            if (showEntryContents) {
                const content = shortenStrRec(entry.content);
                if (typeof content === 'object') {
                    const properties = Object.keys(entry.content);
                    for (const property of properties) {
                        const propertyParentId = `${entryHash}:${property}`;
                        entryNodes.push({
                            data: {
                                id: propertyParentId,
                                parent: entryHash,
                            },
                        });
                        entryNodes.push({
                            data: {
                                id: `${propertyParentId}:key`,
                                label: property,
                                parent: propertyParentId,
                            },
                        });
                        entryNodes.push({
                            data: {
                                id: `${propertyParentId}:value`,
                                label: content[property],
                                parent: propertyParentId,
                            },
                        });
                    }
                }
                else {
                    entryNodes.push({
                        data: {
                            id: `${entryHash}:content`,
                            label: content,
                            parent: entryHash,
                        },
                    });
                }
            }
            // Get implicit links from the entry
            if (getAppEntryType(newEntryHeader.header.content.entry_type)) {
                const implicitLinks = getImplicitLinks(Object.keys(details), entry.content);
                for (const implicitLink of implicitLinks) {
                    if (!excludedEntryTypes.includes(entryTypes[implicitLink.target])) {
                        linksEdges.push({
                            data: {
                                id: `${entryHash}->${implicitLink.target}`,
                                source: entryHash,
                                target: implicitLink.target,
                                label: implicitLink.label,
                            },
                            classes: ['implicit'],
                        });
                    }
                }
            }
            // Get the explicit links from the entry
            const linksDetails = links[entryHash];
            for (const linkVal of linksDetails) {
                const tag = !linkVal.tag || typeof linkVal.tag === 'string'
                    ? linkVal.tag
                    : JSON.stringify(linkVal.tag);
                const target = linkVal.target;
                if (!excludedEntryTypes.includes(entryTypes[target])) {
                    const edgeData = {
                        data: {
                            id: `${entryHash}->${target}`,
                            source: entryHash,
                            target,
                        },
                        classes: ['explicit'],
                    };
                    if (tag) {
                        edgeData.data['label'] = tag;
                    }
                    linksEdges.push(edgeData);
                }
            }
            // Get the updates edges for the entry
            const updateHeaders = detail.headers.filter((h) => h.header.content.original_header_address &&
                h.header.content.original_entry_address === entryHash);
            for (const update of updateHeaders) {
                const strUpdateEntryHash = update.header.content.entry_hash;
                linksEdges.push({
                    data: {
                        id: `${entryHash}-replaced-by-${strUpdateEntryHash}`,
                        source: entryHash,
                        target: strUpdateEntryHash,
                        label: 'replaced by',
                    },
                    classes: ['update-edge'],
                });
            }
            // Add deleted class if is deleted
            if (detail.entry_dht_status === EntryDhtStatus.Dead)
                entryNodes
                    .find((node) => node.data.id === entryHash)
                    .classes.push('deleted');
        }
        entryTypeCount[entryType] += 1;
    }
    return {
        entries: [...entryNodes, ...linksEdges],
        entryTypes: Object.keys(entryTypeCount),
    };
}
function getImplicitLinks(allEntryIds, value) {
    if (!value)
        return [];
    if (typeof value === 'string') {
        return allEntryIds.includes(value)
            ? [{ label: undefined, target: value }]
            : [];
    }
    if (Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'string') {
        return value
            .filter((v) => allEntryIds.includes(v))
            .map((v) => ({ target: v, label: undefined }));
    }
    if (typeof value === 'object') {
        const values = Object.entries(value).map(([key, v]) => {
            const implicitLinks = getImplicitLinks(allEntryIds, v);
            for (const implicitLink of implicitLinks) {
                if (!implicitLink.label) {
                    implicitLink.label = key;
                }
            }
            return implicitLinks;
        });
        return [].concat(...values);
    }
    return [];
}
/** Helper functions  */
function sortEntries(entryHashes, details) {
    return entryHashes.sort((keyA, keyB) => compareEntries(details, keyA, keyB));
}
function compareHeader(headerA, headerB) {
    return (timestampToMillis(headerA.header.content.timestamp) -
        timestampToMillis(headerB.header.content.timestamp));
}
function compareEntries(details, hashA, hashB) {
    const headersA = Object.values(details[hashA].headers).sort(compareHeader);
    const headersB = Object.values(details[hashB].headers).sort(compareHeader);
    return headersA.length > 0
        ? timestampToMillis(headersA[0].header.content.timestamp)
        : 0 - headersB.length > 0
            ? timestampToMillis(headersB[0].header.content.timestamp)
            : 0;
}

export { allEntries, getImplicitLinks, sourceChainNodes };
//# sourceMappingURL=graph.js.map
