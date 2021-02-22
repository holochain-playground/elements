import { Hash, Element, CreateLink } from '@holochain-open-dev/core-types';
import { GetStrategy } from '../../../../types';
import {
  buildDeleteLink,
  buildShh,
} from '../../../cell/source-chain/builder-headers';
import { putElement } from '../../../cell/source-chain/put';
import { HostFn, HostFnWorkspace } from '../../host-fn';

export type DeleteLinkFn = (args: { header_hash: Hash }) => Promise<Hash>;

// Creates a new Create header and its entry in the source chain
export const delete_link: HostFn<DeleteLinkFn> = (
  worskpace: HostFnWorkspace
): DeleteLinkFn => async ({ header_hash }): Promise<Hash> => {
  const elementToDelete = await worskpace.cascade.dht_get(header_hash, {
    strategy: GetStrategy.Contents,
  });

  if (!elementToDelete) throw new Error('Could not find element to be deleted');

  const baseAddress = (elementToDelete.signed_header.header
    .content as CreateLink).base_address;

  if (!baseAddress)
    throw new Error('Header for the given hash is not a CreateLink header');

  const deleteHeader = buildDeleteLink(
    worskpace.state,
    baseAddress,
    header_hash
  );

  const element: Element = {
    signed_header: buildShh(deleteHeader),
    entry: undefined,
  };
  putElement(element)(worskpace.state);

  return element.signed_header.header.hash;
};
