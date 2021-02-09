import { AgentPubKey, Hash } from '@holochain-open-dev/core-types';
import { Cell } from '../cell/cell';
export declare enum NetworkRequestType {
    CALL_REMOTE = "Call Remote",
    ADD_NEIGHBOR = "Add Neighbor",
    PUBLISH_REQUEST = "Publish Request",
    GET_REQUEST = "Get Request"
}
export declare type NetworkRequest<T> = (cell: Cell) => Promise<T>;
export interface NetworkRequestInfo {
    dnaHash: Hash;
    fromAgent: AgentPubKey;
    toAgent: AgentPubKey;
    type: NetworkRequestType;
}
