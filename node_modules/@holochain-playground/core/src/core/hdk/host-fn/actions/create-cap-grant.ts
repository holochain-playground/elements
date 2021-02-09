import {
  Entry,
  EntryType,
  Element,
  Hash,
  CapGrant,
  ZomeCallCapGrant,
  AgentPubKey,
  CapSecret,
} from '@holochain-open-dev/core-types';
import { Cell } from '../../../cell';
import {
  buildCreate,
  buildShh,
} from '../../../cell/source-chain/builder-headers';
import { putElement } from '../../../cell/source-chain/put';
import { HostFn } from '../../host-fn';

export type CreateCapGrant = (cap_grant: ZomeCallCapGrant) => Promise<Hash>;

// Creates a new Create header and its entry in the source chain
export const create_cap_grant: HostFn<CreateCapGrant> = (
  zome_index: number,
  cell: Cell
): CreateCapGrant => async (cap_grant: ZomeCallCapGrant): Promise<Hash> => {
  if (
    (cap_grant.access as {
      Assigned: {
        secret: CapSecret;
        assignees: AgentPubKey[];
      };
    }).Assigned.assignees.find(a => !!a && typeof a !== 'string')
  ) {
    throw new Error('Tried to assign a capability to an invalid agent');
  }

  const entry: Entry = { entry_type: 'CapGrant', content: cap_grant };

  const create = buildCreate(cell.state, entry, 'CapGrant');

  const element: Element = {
    signed_header: buildShh(create),
    entry,
  };
  putElement(element)(cell.state);

  return element.signed_header.header.hash;
};
