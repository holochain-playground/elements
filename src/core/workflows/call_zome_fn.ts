import { Cell } from '../cell';
import { getTipOfChain } from '../cell/source-chain/utils';
import { produce_dht_ops_task } from './produce_dht_ops';

export const callZomeFn = (
  zome: string,
  fnName: string,
  payload: any,
  cap: string
) => async (cell: Cell): Promise<void> => {
  const currentHeader = getTipOfChain(cell.state);

  const actions = cell.simulatedDna[zome][fnName](payload);

  for (const action of actions) {
    await action(cell.state);
  }

  if (getTipOfChain(cell.state) != currentHeader) {
    // Do validation

    // Trigger production of DHT Ops
    cell.triggerWorkflow(produce_dht_ops_task(cell));
  }
};
