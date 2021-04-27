import { LitElement, html, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import { sharedStyles } from '../utils/shared-styles';

import { DhtShard } from '../dht-shard';
import { EntryContents } from '../entry-contents';
import { Card } from 'scoped-material-components/mwc-card';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { Dialog } from 'scoped-material-components/mwc-dialog';
import { Tab } from 'scoped-material-components/mwc-tab';
import { TabBar } from 'scoped-material-components/mwc-tab-bar';
import { PlaygroundElement } from '../../base/playground-element';
import { Conductor } from '@holochain-playground/core';
import { selectCell } from '../utils/selectors';
import { List } from 'scoped-material-components/mwc-list';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { CopyableHash } from '../helpers/copyable-hash';
import { Button } from 'scoped-material-components/mwc-button';
import { HelpButton } from '../helpers/help-button';
import { adminApi } from './admin-api';
import { CallFns } from '../helpers/call-functions';

export class ConductorAdmin extends PlaygroundElement {
  @state()
  private _selectedTabIndex: number = 0;

  get activeConductor(): Conductor | undefined {
    return selectCell(this.activeDna, this.activeAgentPubKey, this.conductors)
      ?.conductor;
  }

  renderHelp() {
    return html`
      <help-button
        heading="Conductor Admin Help"
        style="--mdc-dialog-max-width: 700px"
        class="block-help"
      >
        <span>
          You've selected the node or conductor with Agent ID
          ${this.activeAgentPubKey}. Here you can see its internal state:
          <ul>
            <li>
              <strong>Source Chain</strong>: entries that this node has
              committed. Here you can see in grey the
              <a
                href="https://developer.holochain.org/docs/concepts/3_private_data/"
                target="_blank"
                >headers
              </a>
              of the entries, and in colors the entries themselves. When you
              select an entry, the other nodes that are holding the entry DHT
              will be hightlighted in the DHT.
            </li>
            <br />
            <li>
              <strong>DHT Shard</strong>: slice of the DHT that this node is
              holding. You can see the list of all the entries that this node is
              holding indexed by their hash, and metadata associated to those
              entries.
            </li>
            <br />
            <li>
              <strong>Commit Entries</strong>: here you can actually create
              entries yourself. They will be created on behalf of this node. Try
              it! You can create an entry and see where it lands on the DHT, and
              go to the DHT Shard of those nodes and check it's there.
            </li>
          </ul>
        </span>
      </help-button>
    `;
  }

  renderCells(conductor: Conductor) {
    return html` <table>
      <thead>
        <tr style="margin-bottom: 4px;">
          <th class="bottom-border">Dna</th>
          <th class="bottom-border">Agent</th>
        </tr>
      </thead>
      ${conductor.getAllCells().map(
        (cell) =>
          html`<tr>
            <td class="bottom-border">
              <copyable-hash
                .hash=${cell.dnaHash}
                .sliceLength=${10}
              ></copyable-hash>
            </td>
            <td class="bottom-border">
              <copyable-hash
                .hash=${cell.agentPubKey}
                .sliceLength=${10}
              ></copyable-hash>
            </td>
            <td>
              <mwc-button
                label="Select Cell"
                .disabled=${cell.dnaHash === this.activeDna &&
                cell.agentPubKey === this.activeAgentPubKey}
                @click=${() =>
                  this.updatePlayground({
                    activeAgentPubKey: cell.agentPubKey,
                    activeDna: cell.dnaHash,
                    activeHash: undefined,
                  })}
              ></mwc-button>
            </td>
          </tr> `
      )}
    </table>`;
  }

  renderAdminAPI(conductor: Conductor) {
    const adminApiFns = adminApi(conductor);

    return html`<call-functions .callableFns=${adminApiFns}></call-functions>`;
  }

  renderContent() {
    if (!this.activeConductor)
      return html`
        <div class="column fill center-content">
          <span class="placeholder"
            >Select a cell to inspect its conductor</span
          >
        </div>
      `;
    return html`
      <div class="column fill">
        <mwc-tab-bar
          @MDCTabBar:activated=${(e) =>
            (this._selectedTabIndex = e.detail.index)}
          .activeIndex=${this._selectedTabIndex}
        >
          <mwc-tab label="Cells"></mwc-tab>
          <mwc-tab label="Admin API"></mwc-tab>
        </mwc-tab-bar>
        <div style="padding: 16px;" class="column fill">
          ${this._selectedTabIndex === 0
            ? this.renderCells(this.activeConductor)
            : this.renderAdminAPI(this.activeConductor)}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        ${this.renderHelp()}
        <div class="column fill">
          <div class="row" style="padding: 16px">
            <div class="column" style="flex: 1;">
              <span class="title"
                >Conductor
                Admin${this.activeConductor
                  ? html`<span class="placeholder"
                      >, for ${this.activeConductor.name}</span
                    >`
                  : html``}</span
              >
            </div>
          </div>
          <div class="column fill">${this.renderContent()}</div>
        </div>
      </mwc-card>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
        .bottom-border {
          border-bottom: 1px solid lightgrey;
        }
      `,
    ];
  }

  static elementDefinitions = {
    'copyable-hash': CopyableHash,
    'call-functions': CallFns,
    'mwc-tab': Tab,
    'mwc-tab-bar': TabBar,
    'mwc-list': List,
    'mwc-list-item': ListItem,
    'mwc-card': Card,
    'mwc-button': Button,
    'mwc-icon-button': IconButton,
    'help-button': HelpButton,
  };
}
