import { CellState } from '../../types/cell-state';
import { AgentPubKey, Hash } from '../../types/common';
import { putElement } from '../cell/source-chain/actions';
import {
  buildAgentValidationPkg,
  buildDna,
} from '../cell/source-chain/builder-headers';

export const genesis = (
  agentId: AgentPubKey,
  dnaHash: Hash,
  membrane_proof: any
) => async (state: CellState): Promise<void> => {
  const dna = buildDna(dnaHash, agentId);

  await putElement({ header: dna, maybe_entry: null })(state);
  
  const pkg = buildAgentValidationPkg(state, membrane_proof);
  await putElement({ header: pkg, maybe_entry: null })(state);
};
