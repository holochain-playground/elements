import { Cell, Workspace } from '../cell';
import { HostFnWorkspace } from './host-fn';
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
import { get, Get } from './host-fn/get';
import { HashEntry, hash_entry } from './host-fn/hash-entry';
import { path, Path } from './path';

export interface SimulatedZomeFunctionContext {
  create_entry: CreateEntry;
  get: Get;
  hash_entry: HashEntry;
  create_link: CreateLink;
  create_cap_grant: CreateCapGrant;
  delete_cap_grant: DeleteCapGrant;
  call_remote: CallRemote;
  path: Path;
}

export function buildZomeFunctionContext(
  workspace: HostFnWorkspace,
  zome_index: number
): SimulatedZomeFunctionContext {
  return {
    create_entry: create_entry(workspace, zome_index),
    hash_entry: hash_entry(workspace, zome_index),
    get: get(workspace, zome_index),
    create_link: create_link(workspace, zome_index),
    create_cap_grant: create_cap_grant(workspace, zome_index),
    delete_cap_grant: delete_cap_grant(workspace, zome_index),
    call_remote: call_remote(workspace, zome_index),
    path,
  };
}
