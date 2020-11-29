import { Cell } from '../core/cell';
import { location, compareBigInts } from './hash';
import { Create, Header, NewEntryHeader, Update } from '../types/header';
import { Entry, getAppEntryType, getEntryTypeString } from '../types/entry';
import { Dictionary } from '../types/common';
import { getAllHeldEntries, getEntryDetails } from '../core/cell/dht/get';
import { EntryDetails, EntryDhtStatus } from '../types/metadata';
import { timestampToMillis } from '../types/timestamp';

export function dnaNodes(cells: Cell[]) {
  // const images = ['smartphone', 'desktop', 'laptop'];

  const sortedCells = cells.sort((a: Cell, b: Cell) =>
    compareBigInts(location(a.agentPubKey), location(b.agentPubKey))
  );
  const cellNodes = sortedCells.map((cell) => ({
    data: {
      id: cell.agentPubKey,
      label: `${cell.agentPubKey.substr(0, 6)}...`,
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
    const header: Header = cell.state.CAS[headerHash];

    nodes.push({
      data: { id: headerHash, data: header, label: header.type },
      classes: ['header', header.type],
    });

    if ((header as Create).prev_header) {
      nodes.push({
        data: {
          id: `${headerHash}->${(header as Create).prev_header}`,
          source: headerHash,
          target: (header as Create).prev_header,
        },
      });
    }
  }

  for (const headerHash of headersHashes) {
    const header: Header = cell.state.CAS[headerHash];

    if ((header as NewEntryHeader).entry_hash) {
      const newEntryHeader = header as NewEntryHeader;

      const entry: Entry = cell.state.CAS[newEntryHeader.entry_hash];

      const entryType: string = getEntryTypeString(newEntryHeader.entry_type);

      nodes.push({
        data: {
          id: newEntryHeader.entry_hash,
          data: entry,
          label: `${entryType}`,
        },
        classes: [entryType],
      });
      nodes.push({
        data: {
          id: `${headerHash}->${newEntryHeader.entry_hash}`,
          source: headerHash,
          target: newEntryHeader.entry_hash,
        },
      });
    }
  }

  return nodes;
}

export function allEntries(cells: Cell[], showAgentIds: boolean) {
  const entries: Dictionary<Entry> = {};
  const details: Dictionary<EntryDetails> = {};

  for (const cell of cells) {
    for (const entryHash of getAllHeldEntries(cell.state)) {
      entries[entryHash] = cell.state.CAS[entryHash];
      details[entryHash] = getEntryDetails(cell.state, entryHash);
    }
  }

  //  const agentPubKeys = Object.keys(entries).filter(entryHash => details[entryHash].headers.includes(h=> (h as Agent)));

  const sortedEntries = sortEntries(Object.keys(entries), details);

  const linksEdges = [];
  const entryNodes = [];
  const entryTypeCount = {};

  for (const entryHash of sortedEntries) {
    const entry = entries[entryHash];
    const detail = details[entryHash];

    // Get base nodes and edges
    const newEntryHeader = detail.headers[0];
    const entryType = getEntryTypeString(newEntryHeader.entry_type);

    if (!entryTypeCount[entryType]) entryTypeCount[entryType] = 0;

    entryNodes.push({
      data: {
        id: entryHash,
        data: entry,
        label: `${entryType}${entryTypeCount[entryType]}`,
      },
      classes: [entryType] as string[],
    });

    entryTypeCount[entryType] += 1;

    // Get implicit links from the entry

    if (getAppEntryType(newEntryHeader.entry_type)) {
      const implicitLinks = getImplicitLinks(
        Object.keys(entries),
        entry.content
      );

      for (const implicitLink of implicitLinks) {
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

    // Get the explicit links from the entry
    const linksDetails = detail.links;

    for (const linkVal of linksDetails) {
      linksEdges.push({
        data: {
          id: `${entryHash}->${linkVal.target}`,
          source: entryHash,
          target: linkVal.target,
          label: `Tag: ${linkVal.tag}`,
        },
        classes: ['explicit'],
      });
    }

    // Get the updates edges for the entry
    const updateHeaders = detail.headers.filter(
      (h) =>
        (h as Update).original_header_address &&
        (h as Update).original_entry_address === entryHash
    ) as Update[];
    for (const update of updateHeaders) {
      linksEdges.push({
        data: {
          id: `${entryHash}-replaced-by-${update.entry_hash}`,
          source: entryHash,
          target: update.entry_hash,
          label: 'replaced by',
        },
        classes: ['update-link'],
      });
    }

    // Add deleted class if is deleted
    if (detail.dhtStatus === EntryDhtStatus.Dead)
      entryNodes
        .find((node) => node.data.id === entryHash)
        .classes.push('deleted');
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
  return [...entryNodes, ...linksEdges];
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

function compareHeader(headerA: Header, headerB: Header) {
  return (
    timestampToMillis(headerA.timestamp) - timestampToMillis(headerB.timestamp)
  );
}

function compareEntries(
  details: Dictionary<EntryDetails>,
  hashA: string,
  hashB: string
) {
  const headersA: Header[] = Object.values(details[hashA].headers).sort(
    compareHeader
  ) as Header[];
  const headersB: Header[] = Object.values(details[hashB].headers).sort(
    compareHeader
  ) as Header[];
  return headersA.length > 0
    ? timestampToMillis(headersA[0].timestamp)
    : 0 - headersB.length > 0
    ? timestampToMillis(headersB[0].timestamp)
    : 0;
}
