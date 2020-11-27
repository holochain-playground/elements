import { LitElement, html, query, css, property } from 'lit-element';
import * as cytoscape from 'cytoscape';
import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-icon-button';
import '@material/mwc-button';

import { dnaNodes } from '../processors/graph';
import { selectAllCells, selectHoldingCells } from './utils/selectors';
import { sharedStyles } from './utils/sharedStyles';
import { vectorsEqual } from '../processors/utils';
import { consumePlayground, UpdateContextEvent } from './utils/context';
import { Conductor } from '../core/conductor';

@consumePlayground()
export class DHTGraph extends LitElement {
  @property({ type: String })
  private activeDna: string | undefined;
  @property({ type: Array })
  private conductors: Conductor[] | undefined;

  @property({ type: String })
  private activeEntryHash: string | undefined;
  @property({ type: String })
  private activeAgentPubKey: string | undefined;

  @query('#dht-help')
  private dhtHelp: Dialog;

  @query('#graph')
  private graph: any;

  private lastNodes: string[] = [];

  private cy;
  private layout;

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }

  async firstUpdated() {
    const nodes = dnaNodes(selectAllCells(this.activeDna, this.conductors));

    this.cy = cytoscape({
      container: this.graph,
      boxSelectionEnabled: false,
      autoungrabify: true,
      userPanningEnabled: false,
      userZoomingEnabled: false,
      layout: { name: 'circle' },
      style: `
            node {
              background-color: gray;
              label: data(label);
              font-size: 20px;
              width: 50px;
              height: 50px;
            }

            
             .desktop{
                background-image: url("assets/desktop_windows-outline-white-36dp.svg");
              }
            
             .laptop{
                background-image: url("assets/laptop-outline-white-36dp.svg");
             }
            

            .selected {
              border-width: 4px;
              border-color: black;
              border-style: solid;
            }

            .smartphone{
              background-image: url("assets/smartphone-outline-white-36dp.svg");
            }
    
            .highlighted {
              background-color: yellow;
            }
    
            edge {
              width: 1;
              line-style: dotted;
            }
          `,
    });

    this.cy.on('tap', 'node', (evt) => {
      this.dispatchEvent(
        new UpdateContextEvent({
          activeAgentPubKey: evt.target.id(),
          activeEntryHash: null,
        })
      );
    });
  }

  highlightNodesWithEntry(entryHash: string) {
    const allCells = selectAllCells(this.activeDna, this.conductors);

    allCells.forEach((cell) =>
      this.cy.getElementById(cell.agentPubKey).removeClass('highlighted')
    );
    const holdingCells = selectHoldingCells(entryHash, allCells);

    for (const cell of holdingCells) {
      this.cy.getElementById(cell.agentPubKey).addClass('highlighted');
    }
  }

  updated(changedValues) {
    super.updated(changedValues);

    const cells = selectAllCells(this.activeDna, this.conductors);

    const newAgentIds = cells.map((c) => c.agentPubKey);
    if (!vectorsEqual(this.lastNodes, newAgentIds)) {
      if (this.layout) this.layout.stop();
      this.cy.remove('nodes');

      const nodes = dnaNodes(cells);
      this.cy.add(nodes);

      this.layout = this.cy.elements().makeLayout({ name: 'circle' });
      this.layout.run();
      this.lastNodes = newAgentIds;
    }

    cells.forEach((cell) =>
      this.cy.getElementById(cell.agentPubKey).removeClass('selected')
    );
    this.cy.getElementById(this.activeAgentPubKey).addClass('selected');

    this.highlightNodesWithEntry(this.activeEntryHash);
  }

  renderDHTHelp() {
    return html`
      <mwc-dialog id="dht-help" heading="DHT Help">
        <span>
          This is a visual interactive representation of a holochain
          <a
            href="https://developer.holochain.org/docs/concepts/4_public_data_on_the_dht/"
            target="_blank"
            >DHT</a
          >, with ${this.conductors.length} nodes.
          <br />
          <br />
          In the DHT, all nodes have a <strong>public and private key</strong>.
          The public key is visible and shared througout the network, but
          private keys never leave their nodes. This public key is of 256 bits
          an it's actually the node's ID, which you can see labeled besides the
          nodes (encoded in base58 strings).
          <br />
          <br />
          If you pay attention, you will see that
          <strong>all nodes in the DHT are ordered alphabetically</strong>. This
          is because the nodes organize themselves in neighborhoods: they are
          more connected with the nodes that are closest to their ID, and less
          connected with the nodes that are far.
        </span>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
  }

  render() {
    return html`${this.renderDHTHelp()}
      <div class="column fill" style="position: relative">
        <h3 style="position: absolute; left: 28px; top: 28px;" class="title">
          DHT Nodes
        </h3>
        <div id="graph" style="height: 98%"></div>

        <mwc-icon-button
          style="position: absolute; right: 20px; top: 20px;"
          icon="help_outline"
          @click=${() => (this.dhtHelp.open = true)}
        ></mwc-icon-button>
      </div>`;
  }
}

customElements.define('holochain-playground-dht-graph', DHTGraph);
