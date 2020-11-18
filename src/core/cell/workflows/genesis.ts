import { CellState } from '../../../types/cell-state';
import { AgentPubKey, Hash } from '../../../types/common';
import { Cell } from '../../cell';
import {
  buildAgentValidationPkg,
  buildDna,
} from '../source-chain/builder-headers';
import { putElement } from '../source-chain/put';
import { produce_dht_ops_task } from './produce_dht_ops';

export const genesis = (
  agentId: AgentPubKey,
  dnaHash: Hash,
  membrane_proof: any
) => async (cell: Cell): Promise<void> => {
  const dna = buildDna(dnaHash, agentId);

  putElement({ header: dna, maybe_entry: null })(cell.state);
  
  const pkg = buildAgentValidationPkg(cell.state, membrane_proof);
  putElement({ header: pkg, maybe_entry: null })(cell.state);

  cell.triggerWorkflow(produce_dht_ops_task(cell));
};
