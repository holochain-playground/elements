import { AgentPubKey, CapSecret } from '@holochain-open-dev/core-types';
import { Cell } from '../../cell';
import { HostFn } from '../host-fn';

export type CallRemote = (args: {
  agent: AgentPubKey;
  zome: string;
  fn_name: string;
  cap_secret: CapSecret | undefined;
  payload: any;
}) => Promise<any>;

// Creates a new Create header and its entry in the source chain
export const call_remote: HostFn<CallRemote> = (
  zome_index: number,
  cell: Cell
): CallRemote => async (args): Promise<any> => {
  return cell.p2p.call_remote(
    args.agent,
    args.zome,
    args.fn_name,
    args.cap_secret,
    args.payload
  );
};
