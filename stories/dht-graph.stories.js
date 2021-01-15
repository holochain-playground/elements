import '../dist/elements/holochain-playground-provider.js';
import '../dist/elements/holochain-playground-dht-graph.js';

import { withKnobs } from '@storybook/addon-knobs';
import { html } from 'lit-element';
import { withWebComponentsKnobs } from 'storybook-addon-web-components-knobs';

export default {
  title: 'DHT Graph',
  component: 'holochain-playground-dht-graph',

  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { options: { selectedPanel: 'storybookjs/knobs/panel' } },
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
