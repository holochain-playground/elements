import { html } from 'lit';
import {
  GoldenLayout,
  GoldenLayoutRegister,
} from '@scoped-elements/golden-layout';

import { CallZomeFns } from '../elements/call-zome-fns';
import { ConductorAdmin } from '../elements/conductor-admin';
import { DhtCells } from '../elements/dht-cells';
import { EntryContents } from '../elements/entry-contents';
import { EntryGraph } from '../elements/entry-graph';
import { HappsManager } from '../elements/happs-manager';
import { SourceChain } from '../elements/source-chain';
import { ZomeFnsResults } from '../elements/zome-fns-results';
import { PlaygroundContainer } from '../base/playground-container';
import { SimulatedPlaygroundContainer } from '../base/simulated-playground-container';

export class HolochainPlaygroundGoldenLayout extends SimulatedPlaygroundContainer {
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
            <div
              style="height: 100%; width: 100%; overflow: auto; display: flex;"
            >
              <source-chain style="flex: 1; margin: 8px;"></source-chain>
            </div>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="dht-cells">
          <template>
            <div
              style="height: 100%; width: 100%; overflow: auto; display: flex;"
            >
              <dht-cells style="flex: 1; margin: 8px;"></dht-cells>
            </div>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="conductor-admin">
          <template>
            <div
              style="height: 100%; width: 100%; overflow: auto; display: flex;"
            >
              <conductor-admin style="flex: 1; margin: 8px;"></conductor-admin>
            </div>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="call-zome-fns">
          <template>
            <div
              style="height: 100%; width: 100%; overflow: auto; display: flex;"
            >
              <call-zome-fns style="flex: 1; margin: 8px;"></call-zome-fns>
            </div>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="entry-contents">
          <template>
            <div
              style="height: 100%; width: 100%; overflow: auto; display: flex;"
            >
              <entry-contents style="flex: 1; margin: 8px;"></entry-contents>
            </div>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="entry-graph">
          <template>
            <div
              style="height: 100%; width: 100%; overflow: auto; display: flex;"
            >
              <entry-graph style="flex: 1; margin: 8px;"></entry-graph>
            </div>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="happs-manager">
          <template>
            <div
              style="height: 100%; width: 100%; overflow: auto; display: flex;"
            >
              <happs-manager style="flex: 1; margin: 8px;"></happs-manager>
            </div>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="zome-fns-results">
          <template>
            <div
              style="height: 100%; width: 100%; overflow: auto; display: flex;"
            >
              <zome-fns-results
                style="flex: 1; margin: 8px;"
              ></zome-fns-results>
            </div>
          </template>
        </golden-layout-register>

        ${super.render()}
      </golden-layout>
    `;
  }

  static get scopedElements() {
    return {
      ...SimulatedPlaygroundContainer.scopedElements,
      'golden-layout': GoldenLayout,
      'golden-layout-register': GoldenLayoutRegister,
    };
  }
}
