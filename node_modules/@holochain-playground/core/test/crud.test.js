import { createConductors, demoDnaTemplate } from '../dist';
import { expect } from '@esm-bundle/chai';
import { sleep } from './utils';

describe('CRUD', () => {
  it('create, update and delete an entry', async function () {
    this.timeout(0);

    const conductors = await createConductors(10, [], demoDnaTemplate());
    await sleep(10000);

    const cell = conductors[0].getAllCells()[0];

    let hash = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'create_entry',
      payload: { content: 'hi' },
      zome: 'demo_entries',
    });

    expect(hash).to.be.ok;
    await sleep(4000);

    const content = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'get',
      payload: { hash },
      zome: 'demo_entries',
    });

    expect(content).to.be.ok;

    hash = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'update_entry',
      payload: {
        original_header_address: hash,
        new_content: 'hi2',
      },
      zome: 'demo_entries',
    });

    expect(hash).to.be.ok;

    hash = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'delete_entry',
      payload: {
        deletes_address: hash,
      },
      zome: 'demo_entries',
    });

    expect(hash).to.be.ok;
  });
});
