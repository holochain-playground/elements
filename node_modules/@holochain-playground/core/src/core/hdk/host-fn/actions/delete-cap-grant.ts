import { Element, Hash, NewEntryHeader } from '@holochain-open-dev/core-types';
import { GetStrategy } from '../../../../types';
import { Cell } from '../../../cell';
import { Cascade } from '../../../cell/cascade';
import {
  buildDelete,
  buildShh,
} from '../../../cell/source-chain/builder-headers';
import { putElement } from '../../../cell/source-chain/put';
import { HostFn } from '../../host-fn';

export type DeleteCapGrant = (args: { header_hash: Hash }) => Promise<Hash>;

// Creates a new Create header and its entry in the source chain
export const delete_cap_grant: HostFn<DeleteCapGrant> = (
  zome_index: number,
  cell: Cell
): DeleteCapGrant => async ({ header_hash }): Promise<Hash> => {
  const cascade = new Cascade(cell);
  const elementToDelete = await cascade.dht_get(header_hash, {
    strategy: GetStrategy.Contents,
  });

  if (!elementToDelete) throw new Error('Could not find element to be deleted');

  const deletesEntryAddress = (elementToDelete.signed_header.header
    .content as NewEntryHeader).entry_hash;

  const deleteHeader = buildDelete(
    cell.state,
    header_hash,
    deletesEntryAddress
  );

  const element: Element = {
    signed_header: buildShh(deleteHeader),
    entry: undefined,
  };
  putElement(element)(cell.state);

  return element.signed_header.header.hash;
};
