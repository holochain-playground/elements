import { Conductor } from '@holochain-playground/core';

export function allCells(conductors: Conductor[]) {
  const nodes = [];
  const links = [];

  for (const conductor of conductors) {
    const conductorCells = conductor.getAllCells();

    for (const cell of conductorCells) {
      const nodeId = JSON.stringify(cell.cellId);
      nodes.push({
        id: nodeId,
        group: cell.dnaHash,
      });

      for (const neighbor of cell.p2p.getNeighbors()) {
        links.push({
          source: nodeId,
          target: JSON.stringify([cell.dnaHash, neighbor]),
        });
      }

      for (const farNeighbor of cell.p2p.farKnownPeers) {
        links.push({
          source: nodeId,
          target: JSON.stringify([cell.dnaHash, farNeighbor]),
        });
      }
    }

    const allCellsIds = conductorCells.map((c) => JSON.stringify(c.cellId));
    for (let i = 0; i < allCellsIds.length; i++) {
      for (let j = 0; j < i; j++) {
        links.push({
          source: allCellsIds[i],
          target: allCellsIds[j],
        });
      }
    }
  }

  return {
    nodes,
    links,
  };
}
