import { HolochainPlaygroundContainer } from '@holochain-playground/container';
import { HolochainPlaygroundDhtGraph } from '../dist/elements/holochain-playground-dht-graph.js';

import { html } from 'lit-element';

export default {
  title: 'DHT Graph',
  component: 'holochain-playground-dht-graph',
};

export const Simple = () => {
  
  return html`
    <holochain-playground-provider>
      <holochain-playground-dht-graph
        style="height: 100vh"
      ></holochain-playground-dht-graph>
    </holochain-playground-provider>
  `;
};
