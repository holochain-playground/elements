import { Conductor, createConductors, sampleDnaTemplate } from '../dist';
import { expect } from '@esm-bundle/chai';
import { sleep } from './utils';

describe('Conductor', () => {
  it('create conductors and call zome fn', async () => {
    const conductors = await createConductors(10, [], sampleDnaTemplate());

    const cell = conductors[0].getAllCells()[0];

    let result = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'create_entry',
      payload: { content: 'hi' },
      zome: 'sample',
    });

    expect(result).to.be.ok;
    await sleep(1000);
    expect(Object.keys(cell.state.integratedDHTOps).length).to.be.greaterThan(
      10
    );

    result = await conductors[0].callZomeFn({
      cellId: cell.cellId,
      cap: null,
      fnName: 'get',
      payload: {
        hash: result,
      },
      zome: 'sample',
    });

    expect(result).to.be.ok;
  });
});
