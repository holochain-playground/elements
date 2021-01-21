import {
  Cell,
  getEntryDetails,
  compareBigInts,
  location,
  getAllHeldEntries,
  getAppEntryType,
  getEntryTypeString,
  getLinksForEntry,
} from '@holochain-playground/core';
import {
  SignedHeaderHashed,
  Create,
  NewEntryHeader,
  Dictionary,
  EntryDhtStatus,
  EntryDetails,
  Update,
  Entry,
  LinkMetaVal,
} from '@holochain-open-dev/core-types';
import { timestampToMillis, serializeHash } from '@holochain-open-dev/common';
import { BehaviorSubject } from 'rxjs';
import { serializeAndShortenHashesRec } from '../elements/utils/hash';

export function dnaNodes(cells: Cell[]) {
  // const images = ['smartphone', 'desktop', 'laptop'];

  const sortedCells = cells.sort((a: Cell, b: Cell) =>
    compareBigInts(
      location(serializeHash(a.agentPubKey)),
      location(serializeHash(b.agentPubKey))
    )
  );
  const cellNodes = sortedCells.map((cell) => ({
    data: {
      id: cell.agentPubKey,
      label: `${serializeHash(cell.agentPubKey).substr(0, 6)}...`,
    },
    //    classes: [images[Math.floor(Math.random() * 3)]],
  }));
  const edges = sortedCells.map((cell) =>
    cell.p2p.getNeighbors().map((neighbor) => ({
      data: {
        id: `${cell.agentPubKey}->${neighbor}`,
        source: cell.agentPubKey,
        target: neighbor,
      },
    }))
  );

  return [...cellNodes, ...[].concat(...edges)];
}

export function sourceChainNodes(cell: Cell) {
  if (!cell) return [];

  const nodes = [];

  const headersHashes = cell.state.sourceChain;
  for (const headerHash of headersHashes) {
    const strHeaderHash = serializeHash(headerHash);
    const header: SignedHeaderHashed = cell.state.CAS[strHeaderHash];

    nodes.push({
      data: {
        id: strHeaderHash,
        data: header,
        label: header.header.content.type,
      },
      classes: ['header', header.header.content.type],
    });

    if ((header.header.content as Create).prev_header) {
      const strPreviousHeaderHash = serializeHash(
        (header.header.content as Create).prev_header
      );
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
    const strHeaderHash = serializeHash(headerHash);
    const header: SignedHeaderHashed = cell.state.CAS[strHeaderHash];

    if ((header.header.content as NewEntryHeader).entry_hash) {
      const newEntryHeader = header.header.content as NewEntryHeader;
      const strEntryHash = serializeHash(newEntryHeader.entry_hash);
      const entryNodeId = `${strHeaderHash}:${strEntryHash}`;

      const entry: Entry = cell.state.CAS[strEntryHash];

      const entryType: string = getEntryTypeString(
        cell,
        newEntryHeader.entry_type
      );

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

export function allEntries(
  cells: Cell[],
  showEntryContents: boolean,
  excludedEntryTypes: string[]
) {
  const details: Dictionary<EntryDetails> = {};
  const links: Dictionary<LinkMetaVal[]> = {};
  const entryTypes: Dictionary<string> = {};

  for (const cell of cells) {
    for (const entryHash of getAllHeldEntries(cell.state)) {
      const strEntryHash = serializeHash(entryHash);

      details[strEntryHash] = getEntryDetails(cell.state, entryHash);
      links[strEntryHash] = getLinksForEntry(cell.state, entryHash);

      const firstEntryHeader = details[strEntryHash].headers[0];
      if (
        firstEntryHeader &&
        (firstEntryHeader.header.content as NewEntryHeader).entry_type
      ) {
        entryTypes[strEntryHash] = getEntryTypeString(
          cell,
          (firstEntryHeader.header.content as NewEntryHeader).entry_type
        );
      }
    }
  }

  //  const agentPubKeys = Object.keys(entries).filter(entryHash => details[entryHash].headers.includes(h=> (h as Agent)));

  const sortedEntries = sortEntries(Object.keys(details), details);

  const linksEdges = [];
  const entryNodes = [];
  const entryTypeCount = {};

  for (const strEntryHash of sortedEntries) {
    const detail = details[strEntryHash];
    const entry = detail.entry;

    // Get base nodes and edges
    const newEntryHeader: SignedHeaderHashed<NewEntryHeader> = detail
      .headers[0] as SignedHeaderHashed<NewEntryHeader>;
    const entryType = entryTypes[strEntryHash];
    if (!entryTypeCount[entryType]) entryTypeCount[entryType] = 0;
    if (!excludedEntryTypes.includes(entryType)) {
      entryNodes.push({
        data: {
          id: strEntryHash,
          data: entry,
          label: `${entryType}${entryTypeCount[entryType]}`,
        },
        classes: [entryType] as string[],
      });

      if (showEntryContents) {
        const content = serializeAndShortenHashesRec(entry.content);
        if (typeof content === 'object') {
          const properties = Object.keys(entry.content);
          for (const property of properties) {
            const propertyParentId = `${strEntryHash}:${property}`;
            entryNodes.push({
              data: {
                id: propertyParentId,
                parent: strEntryHash,
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
        } else {
          entryNodes.push({
            data: {
              id: `${strEntryHash}:content`,
              label: content,
              parent: strEntryHash,
            },
          });
        }
      }

      // Get implicit links from the entry

      if (getAppEntryType(newEntryHeader.header.content.entry_type)) {
        const implicitLinks = getImplicitLinks(
          Object.keys(details),
          entry.content
        );

        for (const implicitLink of implicitLinks) {
          if (!excludedEntryTypes.includes(entryTypes[implicitLink.target])) {
            linksEdges.push({
              data: {
                id: `${strEntryHash}->${implicitLink.target}`,
                source: strEntryHash,
                target: implicitLink.target,
                label: implicitLink.label,
              },
              classes: ['implicit'],
            });
          }
        }
      }

      // Get the explicit links from the entry
      const linksDetails = links[strEntryHash];
      for (const linkVal of linksDetails) {
        const tag =
          !linkVal.tag || typeof linkVal.tag === 'string'
            ? linkVal.tag
            : JSON.stringify(linkVal.tag);
        const target = serializeHash(linkVal.target);

        if (!excludedEntryTypes.includes(entryTypes[target])) {
          const edgeData = {
            data: {
              id: `${strEntryHash}->${target}`,
              source: strEntryHash,
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
      const updateHeaders = detail.headers.filter(
        (h) =>
          (h.header.content as Update).original_header_address &&
          serializeHash((h.header.content as Update).original_entry_address) ===
            strEntryHash
      ) as SignedHeaderHashed<Update>[];
      for (const update of updateHeaders) {
        const strUpdateEntryHash = update.header.content.entry_hash;
        linksEdges.push({
          data: {
            id: `${strEntryHash}-replaced-by-${strUpdateEntryHash}`,
            source: strEntryHash,
            target: strUpdateEntryHash,
            label: 'replaced by',
          },
          classes: ['update-edge'],
        });
      }

      // Add deleted class if is deleted
      if (detail.entry_dht_status === EntryDhtStatus.Dead)
        entryNodes
          .find((node) => node.data.id === strEntryHash)
          .classes.push('deleted');
    }
    entryTypeCount[entryType] += 1;
  }
  /* 
  if (!showAgentIds) {
    for (const [key, entry] of Object.entries(entries)) {
      if (entry.type === EntryType.AgentId) {
        const links = linksEdges.filter(
          (edge) => edge.data.source === key || edge.data.target === key
        );
        if (links.length === 0) {
          const index = entryNodes.findIndex((node) => node.data.id === key);
          entryNodes.splice(index, 1);
        }
      }
    }
  }
 */

  return {
    entries: [...entryNodes, ...linksEdges],
    entryTypes: Object.keys(entryTypeCount),
  };
}

export function getImplicitLinks(
  allEntryIds: string[],
  value: any
): Array<{ label: string; target: string }> {
  if (!value) return [];
  if (typeof value === 'string') {
    return allEntryIds.includes(value)
      ? [{ label: undefined, target: value }]
      : [];
  }
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === 'string'
  ) {
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

function sortEntries(
  entryHashes: string[],
  details: Dictionary<EntryDetails>
): string[] {
  return entryHashes.sort((keyA, keyB) => compareEntries(details, keyA, keyB));
}

function compareHeader(
  headerA: SignedHeaderHashed,
  headerB: SignedHeaderHashed
) {
  return (
    timestampToMillis(headerA.header.content.timestamp) -
    timestampToMillis(headerB.header.content.timestamp)
  );
}

function compareEntries(
  details: Dictionary<EntryDetails>,
  hashA: string,
  hashB: string
) {
  const headersA: SignedHeaderHashed[] = Object.values(
    details[hashA].headers
  ).sort(compareHeader) as SignedHeaderHashed[];
  const headersB: SignedHeaderHashed[] = Object.values(
    details[hashB].headers
  ).sort(compareHeader) as SignedHeaderHashed[];
  return headersA.length > 0
    ? timestampToMillis(headersA[0].header.content.timestamp)
    : 0 - headersB.length > 0
    ? timestampToMillis(headersB[0].header.content.timestamp)
    : 0;
}
