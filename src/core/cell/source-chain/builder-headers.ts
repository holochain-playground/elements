import { hash } from '../../../processors/hash';
import { CellState } from '../../../types/cell-state';
import { AgentPubKey, Hash } from '../../../types/common';
import { Entry, EntryType } from '../../../types/entry';
import {
  AgentValidationPkg,
  Create,
  Dna,
  HeaderType,
} from '../../../types/header';
import { now } from '../../../types/timestamp';
import { getAuthor, getNextHeaderSeq, getTipOfChain } from './utils';

export function buildDna(dnaHash: Hash, agentId: AgentPubKey): Dna {
  const dna: Dna = {
    author: agentId,
    hash: dnaHash,
    timestamp: now(),
    type: HeaderType.Dna,
  };

  return dna;
}

export function buildAgentValidationPkg(
  state: CellState,
  membrane_proof: any
): AgentValidationPkg {
  const pkg: AgentValidationPkg = {
    ...buildCommon(state),
    membrane_proof,
    type: HeaderType.AgentValidationPkg,
  };
  return pkg;
}

export async function buildCreate(
  state: CellState,
  entry: Entry,
  entry_type: EntryType
): Promise<Create> {
  const entry_hash = await hash(entry);

  const create: Create = {
    ...buildCommon(state),
    entry_hash,
    entry_type,
    type: HeaderType.Create,
  };
  return create;
}

function buildCommon(state: CellState) {
  const author = getAuthor(state);
  const header_seq = getNextHeaderSeq(state);
  const prev_header = getTipOfChain(state);
  const timestamp = now();

  return {
    author,
    header_seq,
    prev_header,
    timestamp,
  };
}
