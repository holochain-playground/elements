import { distance } from '@holochain-playground/core';

function dhtCellsNodes(cells) {
    const sortedCells = cells.sort((a, b) => distance(a.agentPubKey, b.agentPubKey));
    const cellNodes = sortedCells.map((cell) => ({
        data: {
            id: cell.agentPubKey,
            label: `${cell.agentPubKey.substr(0, 10)}...`,
        },
    }));
    return cellNodes;
}
function neighborsEdges(cells) {
    const edges = cells.map((cell) => cell.p2p.getNeighbors().map((neighbor) => ({
        data: {
            id: `${cell.agentPubKey}->${neighbor}`,
            source: cell.agentPubKey,
            target: neighbor,
        },
        classes: ['neighbor-edge'],
    })));
    return [].concat(...edges.filter((e) => e.length > 0));
}

export { dhtCellsNodes, neighborsEdges };
//# sourceMappingURL=processors.js.map
