import { Cell } from '../cell';
import {
  CreateCapGrant,
  create_cap_grant,
} from './host-fn/actions/create-cap-grant';
import { CreateEntry, create_entry } from './host-fn/actions/create-entry';
import { CreateLink, create_link } from './host-fn/actions/create-link';
import {
  DeleteCapGrant,
  delete_cap_grant,
} from './host-fn/actions/delete-cap-grant';
import { CallRemote, call_remote } from './host-fn/call-remote';
import { HashEntry, hash_entry } from './host-fn/hash-entry';
import { path, Path } from './path';

export interface SimulatedZomeFunctionContext {
  create_entry: CreateEntry;
  hash_entry: HashEntry;
  create_link: CreateLink;
  create_cap_grant: CreateCapGrant;
  delete_cap_grant: DeleteCapGrant;
  call_remote: CallRemote;
  path: Path;
}

export function buildZomeFunctionContext(
  zome_index: number,
  cell: Cell
): SimulatedZomeFunctionContext {
  return {
    create_entry: create_entry(zome_index, cell),
    hash_entry: hash_entry(zome_index, cell),
    create_link: create_link(zome_index, cell),
    create_cap_grant: create_cap_grant(zome_index, cell),
    delete_cap_grant: delete_cap_grant(zome_index, cell),
    call_remote: call_remote(zome_index, cell),
    path,
  };
}
