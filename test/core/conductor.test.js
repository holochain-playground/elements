import { expect, fixture, html } from '@open-wc/testing';


describe('Plugin - semantic-dom-diff', () => {
  it('can semantically compare full dom trees', async () => {
    const el = await fixture(
      `<holochain-playground-provider>
        <holochain-playground-dht-graph></holochain-dht-graph>
      </holochain-playground-provider>`
    );
    expect(el).dom.to.equal('<div><h1>Hey</h1></div>');
  });
});
