import { AgentPubKey } from '@holochain-open-dev/core-types';
import { Cell } from '../../cell';
import { buildZomeFunctionContext } from '../../hdk/context';
import { getTipOfChain, valid_cap_grant } from '../source-chain/utils';
import { produce_dht_ops_task } from './produce_dht_ops';
import { Workflow, WorkflowType } from './workflows';

/**
 * Calls the zome function of the cell DNA
 * This can only be called in the simulated mode: we can assume that cell.simulatedDna exists
 */
export const callZomeFn = (
  zomeName: string,
  fnName: string,
  payload: any,
  provenance: AgentPubKey,
  cap: string
) => async (
  cell: Cell
): Promise<{ result: any; triggers: Array<Workflow<any, any>> }> => {
  if (!valid_cap_grant(cell.state, zomeName, fnName, provenance, cap))
    throw new Error('Unauthorized Zome Call');

  const currentHeader = getTipOfChain(cell.state);

  const dna = cell.getSimulatedDna();
  if (!dna)
    throw new Error(
      `Trying to do a simulated call to a cell that is not simulated`
    );

  const zomeIndex = dna.zomes.findIndex(zome => zome.name === zomeName);
  if (zomeIndex < 0)
    throw new Error(`There is no zome with the name ${zomeName} in this DNA`);

  if (!dna.zomes[zomeIndex].zome_functions[fnName])
    throw new Error(
      `There isn't a function with the name ${fnName} in this zome with the name ${zomeName}`
    );

  const context = buildZomeFunctionContext(zomeIndex, cell);

  const result = await dna.zomes[zomeIndex].zome_functions[fnName].call(
    context
  )(payload);

  let triggers: Array<Workflow<any, any>> = [];
  if (getTipOfChain(cell.state) != currentHeader) {
    // Do validation

    triggers.push(produce_dht_ops_task(cell));
  }

  return {
    result,
    triggers,
  };
};

export type CallZomeFnWorkflow = Workflow<
  { zome: string; fnName: string; payload: any },
  any
>;

export function call_zome_fn_workflow(
  cell: Cell,
  zome: string,
  fnName: string,
  payload: any,
  provenance: AgentPubKey
): CallZomeFnWorkflow {
  return {
    type: WorkflowType.CALL_ZOME,
    details: {
      fnName,
      payload,
      zome,
    },
    task: () => callZomeFn(zome, fnName, payload, provenance, '')(cell),
  };
}
