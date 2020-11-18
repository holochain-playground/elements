import { CellState } from '../../../types/cell-state';
import { AgentPubKey, Hash } from '../../../types/common';
import {
  buildAgentValidationPkg,
  buildDna,
} from '../source-chain/builder-headers';
import { putElement } from '../source-chain/put';

export const genesis = (
  agentId: AgentPubKey,
  dnaHash: Hash,
  membrane_proof: any
) => async (state: CellState): Promise<void> => {
  const dna = buildDna(dnaHash, agentId);

  putElement({ header: dna, maybe_entry: null })(state);
  
  const pkg = buildAgentValidationPkg(state, membrane_proof);
  putElement({ header: pkg, maybe_entry: null })(state);
};
