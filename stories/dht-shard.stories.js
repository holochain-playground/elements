import { HolochainPlaygroundContainer } from '@holochain-playground/container';
import { HolochainPlaygroundDhtGraph } from '../src/elements/holochain-playground-dht-graph';
import { HolochainPlaygroundDhtShard } from '../src/elements/holochain-playground-dht-shard';

import { html } from 'lit-element';

export default {
  title: 'DHT Shard',
  component: 'holochain-playground-dht-shard',
};

export const Simple = () => {
  return html`
    <holochain-playground-provider
      @ready=${(e) => {
        const conductor = e.detail.conductors[0];

        const cellId = conductor.cells[0].id;
        conductor.callZomeFn({
          cellId,
          zome: 'sample',
          fnName: 'create_entry',
          payload: {
            content: { myman: 'mygirl' },
            entry_type: 'haha',
          },
          cap: null,
        });
      }}
    >
      <div style="display: flex; flex-direction: row; height: 100vh;">
        <holochain-playground-dht-graph
          style="flex: 1;"
        ></holochain-playground-dht-graph>
        <holochain-playground-dht-shard
          style="flex: 1; margin: 20px;"
        ></holochain-playground-dht-shard>
      </div>
    </holochain-playground-provider>
  `;
};
