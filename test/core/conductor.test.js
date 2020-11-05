import { expect, fixture, html } from '@open-wc/testing';

describe('Plugin - semantic-dom-diff', () => {
  it('can semantically compare full dom trees', async () => {
    const el = await fixture(
      `<holochain-playground-container>
        <holochain-playground-dht-graph></holochain-dht-graph>
      </holochain-playground-container>`
    );
    expect(el).dom.to.equal('<div><h1>Hey</h1></div>');
  });
});
