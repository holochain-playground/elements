import { Hash } from '@holochain-open-dev/core-types';
import { HostFn, HostFnWorkspace } from '../../host-fn';
import { common_delete } from './common/delete';

export type DeleteCapGrantFn = (args: { header_hash: Hash }) => Promise<Hash>;

// Creates a new Create header and its entry in the source chain
export const delete_cap_grant: HostFn<DeleteCapGrantFn> = (
  worskpace: HostFnWorkspace
): DeleteCapGrantFn => async ({ header_hash }): Promise<Hash> => {
  return common_delete(worskpace, header_hash);
};
