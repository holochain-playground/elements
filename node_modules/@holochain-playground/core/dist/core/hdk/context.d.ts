import { HostFnWorkspace } from './host-fn';
import { CreateCapGrant } from './host-fn/actions/create-cap-grant';
import { CreateEntry } from './host-fn/actions/create-entry';
import { CreateLink } from './host-fn/actions/create-link';
import { DeleteCapGrant } from './host-fn/actions/delete-cap-grant';
import { AgentInfoFn } from './host-fn/agent-info';
import { CallRemote } from './host-fn/call-remote';
import { Get } from './host-fn/get';
import { HashEntry } from './host-fn/hash-entry';
import { Path } from './path';
export interface SimulatedZomeFunctionContext {
    create_entry: CreateEntry;
    get: Get;
    hash_entry: HashEntry;
    create_link: CreateLink;
    create_cap_grant: CreateCapGrant;
    delete_cap_grant: DeleteCapGrant;
    call_remote: CallRemote;
    agent_info: AgentInfoFn;
    path: Path;
}
export declare function buildZomeFunctionContext(workspace: HostFnWorkspace, zome_index: number): SimulatedZomeFunctionContext;
