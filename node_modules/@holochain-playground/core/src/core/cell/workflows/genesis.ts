import {
  AgentPubKey,
  Hash,
  Entry,
  CellId,
} from '@holochain-open-dev/core-types';
import { Cell, Workflow } from '../../cell';
import {
  buildAgentValidationPkg,
  buildCreate,
  buildDna,
  buildShh,
} from '../source-chain/builder-headers';
import { putElement } from '../source-chain/put';
import { produce_dht_ops_task } from './produce_dht_ops';
import { WorkflowReturn, WorkflowType } from './workflows';

export const genesis = (
  agentId: AgentPubKey,
  dnaHash: Hash,
  membrane_proof: any
) => async (cell: Cell): Promise<WorkflowReturn<void>> => {
  const dna = buildDna(dnaHash, agentId);
  putElement({ signed_header: buildShh(dna), entry: undefined })(cell.state);

  const pkg = buildAgentValidationPkg(cell.state, membrane_proof);
  putElement({ signed_header: buildShh(pkg), entry: undefined })(cell.state);

  const entry: Entry = {
    content: agentId,
    entry_type: 'Agent',
  };
  const create_agent_pub_key_entry = buildCreate(cell.state, entry, 'Agent');
  putElement({
    signed_header: buildShh(create_agent_pub_key_entry),
    entry: entry,
  })(cell.state);

  return {
    result: undefined,
    triggers: [produce_dht_ops_task(cell)],
  };
};

export type GenesisWorkflow = Workflow<
  { cellId: CellId; membrane_proof: any },
  void
>;

export function genesis_task(
  cell: Cell,
  cellId: CellId,
  membrane_proof: any
): GenesisWorkflow {
  return {
    type: WorkflowType.GENESIS,
    details: {
      cellId,
      membrane_proof,
    },
    task: () => genesis(cellId[1], cellId[0], membrane_proof)(cell),
  };
}
