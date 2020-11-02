import { Cell } from '../../cell';
import { getTipOfChain } from '../source-chain/utils';
import { produce_dht_ops_task } from './produce_dht_ops';

/**
 * Calls the zome function of the cell DNA
 * This can only be called in the simulated mode: we can assume that cell.simulatedDna exists
 */
export const callZomeFn = (
  zome: string,
  fnName: string,
  payload: any,
  cap: string
) => async (cell: Cell): Promise<any> => {
  const currentHeader = getTipOfChain(cell.state);

  const actions = cell.simulatedDna[zome][fnName](payload);

  let result = undefined;
  for (const action of actions) {
    result = await action(cell.state);
  }

  if (getTipOfChain(cell.state) != currentHeader) {
    // Do validation

    // Trigger production of DHT Ops
    cell.triggerWorkflow(produce_dht_ops_task(cell));
  }

  return result;
};
