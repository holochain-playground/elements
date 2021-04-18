import {
  AgentPubKey,
  Element,
  NewEntryHeader,
  SignedHeaderHashed,
} from '@holochain-open-dev/core-types';
import { cloneDeep } from 'lodash-es';
import { Cell } from '../../cell';
import { buildZomeFunctionContext } from '../../hdk/context';
import { HostFnWorkspace } from '../../hdk/host-fn';
import { Cascade } from '../cascade/cascade';
import { getTipOfChain, valid_cap_grant } from '../source-chain/utils';
import { produce_dht_ops_task } from './produce_dht_ops';
import { sys_validate_element } from './sys_validation';
import { Workflow, WorkflowType, Workspace } from './workflows';

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
  worskpace: Workspace
): Promise<{ result: any; triggers: Array<Workflow<any, any>> }> => {
  if (!valid_cap_grant(worskpace.state, zomeName, fnName, provenance, cap))
    throw new Error('Unauthorized Zome Call');

  const currentHeader = getTipOfChain(worskpace.state);
  const chain_head_start_len = worskpace.state.sourceChain.length;

  const zomeIndex = worskpace.dna.zomes.findIndex(
    zome => zome.name === zomeName
  );
  if (zomeIndex < 0)
    throw new Error(`There is no zome with the name ${zomeName} in this DNA`);

  if (!worskpace.dna.zomes[zomeIndex].zome_functions[fnName])
    throw new Error(
      `There isn't a function with the name ${fnName} in this zome with the name ${zomeName}`
    );

  const contextState = cloneDeep(worskpace.state);

  const hostFnWorkspace: HostFnWorkspace = {
    cascade: new Cascade(worskpace.state, worskpace.p2p),
    state: contextState,
    dna: worskpace.dna,
    p2p: worskpace.p2p,
  };
  const zomeFnContext = buildZomeFunctionContext(hostFnWorkspace, zomeIndex);

  const result = await worskpace.dna.zomes[zomeIndex].zome_functions[
    fnName
  ].call(zomeFnContext)(payload);

  let triggers: Array<Workflow<any, any>> = [];
  if (getTipOfChain(contextState) !== currentHeader) {
    // Do validation
    let i = chain_head_start_len;

    while (i < contextState.sourceChain.length) {
      const headerHash = contextState.sourceChain[i];
      const signed_header: SignedHeaderHashed = contextState.CAS[headerHash];
      const entry_hash = (signed_header.header.content as NewEntryHeader)
        .entry_hash;

      const element: Element = {
        entry: entry_hash ? contextState.CAS[entry_hash] : undefined,
        signed_header,
      };

      const depsMissing = await sys_validate_element(element, worskpace, worskpace.p2p);
      if (depsMissing) throw new Error(`Could not validate a new element due to missing dependencies`);

      i++;
    }

    triggers.push(produce_dht_ops_task());
  }

  worskpace.state.CAS = contextState.CAS;
  worskpace.state.sourceChain = contextState.sourceChain;

  return {
    result: cloneDeep(result),
    triggers,
  };
};

export type CallZomeFnWorkflow = Workflow<
  { zome: string; fnName: string; payload: any },
  any
>;

export function call_zome_fn_workflow(
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
    task: worskpace =>
      callZomeFn(zome, fnName, payload, provenance, '')(worskpace),
  };
}
