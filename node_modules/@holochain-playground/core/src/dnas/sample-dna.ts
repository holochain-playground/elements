import { GetStrategy } from '../types';
import { SimulatedDnaTemplate, SimulatedZome } from './simulated-dna';

export const sampleZome: SimulatedZome = {
  name: 'sample',
  entry_defs: [
    {
      id: 'sample_entry',
      visibility: 'Public',
    },
    {
      id: 'path',
      visibility: 'Public',
    },
  ],
  zome_functions: {
    create_entry: {
      call: ({ hash_entry, create_entry }) => async ({ content }) => {
        await create_entry({ content, entry_def_id: 'sample_entry' });
        return hash_entry({ content });
      },
      arguments: [{ name: 'content', type: 'any' }],
    },
    get: {
      call: ({ get }) => ({ hash }) => {
        return get(hash, { strategy: GetStrategy.Latest });
      },
      arguments: [{ name: 'hash', type: 'AnyDhtHash' }],
    },
    create_link: {
      call: ({ create_link }) => ({ base, target, tag }) => {
        return create_link({ base, target, tag });
      },
      arguments: [
        { name: 'base', type: 'EntryHash' },
        { name: 'target', type: 'EntryHash' },
        { name: 'tag', type: 'any' },
      ],
    },
    update_entry: {
      call: ({ update_entry }) => ({
        original_header_address,
        new_content,
      }) => {
        return update_entry({
          original_header_address,
          content: new_content,
          entry_def_id: 'sample_entry',
        });
      },
      arguments: [
        { name: 'original_header_address', type: 'HeaderHash' },
        { name: 'new_content', type: 'String' },
      ],
    },
    delete_entry: {
      call: ({ delete_entry }) => ({ deletes_address }) => {
        return delete_entry(deletes_address);
      },
      arguments: [{ name: 'deletes_address', type: 'HeaderHash' }],
    },
  },
};

export function sampleDnaTemplate(): SimulatedDnaTemplate {
  const zomes = [sampleZome];
  return {
    zomes,
  };
}
