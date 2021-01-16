import { HolochainPlaygroundContainer } from '@holochain-playground/container';
import { HolochainPlaygroundSourceChain } from '../src/elements/holochain-playground-source-chain';

import { html } from 'lit-element';

export default {
  title: 'Source Chain',
  component: 'holochain-playground-source-chain',
};

export const Simple = () => {
  return html`
    <holochain-playground-container
      .numberOfSimulatedConductors=${1}
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
    </holochain-playground-container>
  `;
};
