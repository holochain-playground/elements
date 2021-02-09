import { Cell } from '../cell';
import { CreateCapGrant } from './host-fn/actions/create-cap-grant';
import { CreateEntry } from './host-fn/actions/create-entry';
import { CreateLink } from './host-fn/actions/create-link';
import { DeleteCapGrant } from './host-fn/actions/delete-cap-grant';
import { CallRemote } from './host-fn/call-remote';
import { HashEntry } from './host-fn/hash-entry';
import { Path } from './path';
export interface SimulatedZomeFunctionContext {
    create_entry: CreateEntry;
    hash_entry: HashEntry;
    create_link: CreateLink;
    create_cap_grant: CreateCapGrant;
    delete_cap_grant: DeleteCapGrant;
    call_remote: CallRemote;
    path: Path;
}
export declare function buildZomeFunctionContext(zome_index: number, cell: Cell): SimulatedZomeFunctionContext;
