import { createConductors, sampleDnaTemplate } from '../dist';
import { expect } from '@esm-bundle/chai';
import { sleep } from './utils';

describe('CRUD', () => {
  it('create, update and delete an entry', async () => {
    const conductors = await createConductors(10, [], sampleDnaTemplate());

    const cell = conductors[0].getAllCells()[0];

    let hash = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'create_entry',
      payload: { content: 'hi' },
      zome: 'sample',
    });

    expect(hash).to.be.ok;
    await sleep(10);

    hash = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'update_entry',
      payload: {
        original_header_address: hash,
        new_content: 'hi2',
      },
      zome: 'sample',
    });

    expect(hash).to.be.ok;

    hash = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'delete_entry',
      payload: {
        deletes_address: hash,
      },
      zome: 'sample',
    });

    expect(hash).to.be.ok;
  });
});
