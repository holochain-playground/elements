import { html } from 'lit';
import {
  GoldenLayout,
  GoldenLayoutRegister,
} from 'golden-layout-custom-elements';

import { CallZomeFns } from '../elements/call-zome-fns';
import { ConductorAdmin } from '../elements/conductor-admin';
import { DhtCells } from '../elements/dht-cells';
import { EntryContents } from '../elements/entry-contents';
import { EntryGraph } from '../elements/entry-graph';
import { HappsManager } from '../elements/happs-manager';
import { SourceChain } from '../elements/source-chain';
import { ZomeFnsResults } from '../elements/zome-fns-results';
import { HolochainPlaygroundContainer } from '../base/holochain-playground-container';

export class HolochainPlaygroundGoldenLayout extends HolochainPlaygroundContainer {
  render() {
    return html`
      <golden-layout
        .scopedElements=${{
          'source-chain': SourceChain,
          'dht-cells': DhtCells,
          'conductor-admin': ConductorAdmin,
          'call-zome-fns': CallZomeFns,
          'entry-contents': EntryContents,
          'entry-graph': EntryGraph,
          'happs-manager': HappsManager,
          'zome-fns-results': ZomeFnsResults,
        }}
      >
        <golden-layout-register component-type="source-chain">
          <template>
            <source-chain style="flex: 1; margin: 8px;"></source-chain>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="dht-cells">
          <template>
            <dht-cells style="flex: 1; margin: 8px;"></dht-cells>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="conductor-admin">
          <template>
            <conductor-admin style="flex: 1; margin: 8px;"></conductor-admin>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="call-zome-fns">
          <template>
            <call-zome-fns style="flex: 1; margin: 8px;"></call-zome-fns>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="entry-contents">
          <template>
            <entry-contents style="flex: 1; margin: 8px;"></entry-contents>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="entry-graph">
          <template>
            <entry-graph style="flex: 1; margin: 8px;"></entry-graph>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="happs-manager">
          <template>
            <happs-manager style="flex: 1; margin: 8px;"></happs-manager>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="zome-fns-results">
          <template>
            <zome-fns-results style="flex: 1; margin: 8px;"></zome-fns-results>
          </template>
        </golden-layout-register>

        ${super.render()}
      </golden-layout>
    `;
  }

  static get scopedElements() {
    return {
      ...HolochainPlaygroundContainer.scopedElements,
      'golden-layout': GoldenLayout,
      'golden-layout-register': GoldenLayoutRegister,
    };
  }
}
