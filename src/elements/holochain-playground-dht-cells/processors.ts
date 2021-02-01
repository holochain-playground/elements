import {
  Cell,
  compareBigInts,
  distance,
  location,
} from '@holochain-playground/core';

export function dhtCellsNodes(cells: Cell[]) {
  const sortedCells = cells.sort((a: Cell, b: Cell) =>
    distance(a.agentPubKey, b.agentPubKey)
  );
  const cellNodes = sortedCells.map((cell) => ({
    data: {
      id: cell.agentPubKey,
      label: `${cell.agentPubKey.substr(0, 10)}...`,
    },
  }));

  return cellNodes;
}

export function neighborsEdges(cells: Cell[]) {
  const edges: Array<Array<any>> = cells.map((cell) =>
    cell.p2p.getNeighbors().map((neighbor) => ({
      data: {
        id: `${cell.agentPubKey}->${neighbor}`,
        source: cell.agentPubKey,
        target: neighbor,
      },
      classes: ['neighbor-edge'],
    }))
  );

  return [].concat(...edges.filter((e) => e.length > 0));
}
