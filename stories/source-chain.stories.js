import '../dist/elements/holochain-playground-provider.js';
import '../dist/elements/holochain-playground-source-chain.js';

import {
  array,
  boolean,
  button,
  color,
  date,
  select,
  withKnobs,
  text,
  number,
} from '@storybook/addon-knobs';
import { html } from 'lit-element';
import { withWebComponentsKnobs } from 'storybook-addon-web-components-knobs';

export default {
  title: 'Source Chain',
  component: 'holochain-playground-source-chain',

  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { options: { selectedPanel: 'storybookjs/knobs/panel' } },
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
      <holochain-playground-source-chain
        style="height: 100vh"
      ></holochain-playground-source-chain>
    </holochain-playground-provider>
  `;
};
