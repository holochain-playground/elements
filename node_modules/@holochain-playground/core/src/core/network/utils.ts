import { Hash } from '@holochain-open-dev/core-types';
import { distance, compareBigInts } from '../../processors/hash';

export function getClosestNeighbors(
  peers: Hash[],
  targetHash: Hash,
  numNeighbors: number
): Hash[] {
  const sortedPeers = peers.sort((agentA: Hash, agentB: Hash) => {
    const distanceA = distance(targetHash, agentA);
    const distanceB = distance(targetHash, agentB);
    return compareBigInts(distanceA, distanceB);
  });

  return sortedPeers.slice(0, numNeighbors);
}
