import { AgentPubKey, CapSecret } from '@holochain-open-dev/core-types';
import { HostFn } from '../host-fn';
export declare type CallRemote = (args: {
    agent: AgentPubKey;
    zome: string;
    fn_name: string;
    cap_secret: CapSecret | undefined;
    payload: any;
}) => Promise<any>;
export declare const call_remote: HostFn<CallRemote>;
