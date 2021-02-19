import { Element, Hash, NewEntryHeader } from '@holochain-open-dev/core-types';
import { GetStrategy } from '../../../../types';
import { Cell, CellState } from '../../../cell';
import { Cascade } from '../../../cell/cascade';
import {
  buildDelete,
  buildShh,
} from '../../../cell/source-chain/builder-headers';
import { putElement } from '../../../cell/source-chain/put';
import { P2pCell } from '../../../network/p2p-cell';
import { HostFn, HostFnWorkspace } from '../../host-fn';

export type DeleteCapGrant = (args: { header_hash: Hash }) => Promise<Hash>;

// Creates a new Create header and its entry in the source chain
export const delete_cap_grant: HostFn<DeleteCapGrant> = (
  worskpace: HostFnWorkspace
): DeleteCapGrant => async ({ header_hash }): Promise<Hash> => {
  const elementToDelete = await worskpace.cascade.dht_get(header_hash, {
    strategy: GetStrategy.Contents,
  });

  if (!elementToDelete) throw new Error('Could not find element to be deleted');

  const deletesEntryAddress = (elementToDelete.signed_header.header
    .content as NewEntryHeader).entry_hash;

  const deleteHeader = buildDelete(
    worskpace.state,
    header_hash,
    deletesEntryAddress
  );

  const element: Element = {
    signed_header: buildShh(deleteHeader),
    entry: undefined,
  };
  putElement(element)(worskpace.state);

  return element.signed_header.header.hash;
};
