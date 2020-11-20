import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import 'lodash-es';
import '../hash-bca98662.js';
import 'byte-base64';
import '../types/entry.js';
import '../types/timestamp.js';
import '../types/metadata.js';
import '../core/cell/dht/get.js';
import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { LitElement, css, html, query } from 'lit-element';
import { Dialog } from '@material/mwc-dialog';
import { sharedStyles } from './sharedStyles.js';
import { dnaNodes } from '../processors/graph.js';
import { c as cytoscape_cjs } from '../cytoscape.cjs-445d1744.js';
import { selectActiveCells, selectHoldingCells } from '../state/selectors.js';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import { vectorsEqual } from '../processors/utils.js';

class DHTGraph extends blackboardConnect('holochain-playground', LitElement) {
    constructor() {
        super(...arguments);
        this.lastNodes = [];
    }
    static get styles() {
        return [
            sharedStyles,
            css `
        :host {
          display: flex;
        }
      `,
        ];
    }
    async firstUpdated() {
        const nodes = dnaNodes(selectActiveCells(this.blackboard.state));
        this.cy = cytoscape_cjs({
            container: this.shadowRoot.getElementById('graph'),
            boxSelectionEnabled: false,
            elements: nodes,
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
            this.blackboard.update('activeAgentId', evt.target.id());
            this.blackboard.update('activeEntryId', null);
        });
    }
    highlightNodesWithEntry(entryId) {
        selectActiveCells(this.blackboard.state).forEach((cell) => this.cy.getElementById(cell.agentPubKey).removeClass('highlighted'));
        const cells = selectHoldingCells(this.blackboard.state)(entryId);
        for (const cell of cells) {
            this.cy.getElementById(cell.agentPubKey).addClass('highlighted');
        }
    }
    updated(changedValues) {
        super.updated(changedValues);
        if (this.shadowRoot.getElementById('graph')) {
            const newAgentIds = selectActiveCells(this.blackboard.state).map((c) => c.agentPubKey);
            if (!vectorsEqual(this.lastNodes, newAgentIds)) {
                if (this.layout)
                    this.layout.stop();
                this.cy.remove('nodes');
                const nodes = dnaNodes(selectActiveCells(this.blackboard.state));
                this.cy.add(nodes);
                this.layout = this.cy.elements().makeLayout({ name: 'circle' });
                this.layout.run();
                this.lastNodes = newAgentIds;
            }
            selectActiveCells(this.blackboard.state).forEach((cell) => this.cy.getElementById(cell.agentPubKey).removeClass('selected'));
            this.cy
                .getElementById(this.blackboard.state.activeAgentId)
                .addClass('selected');
            this.highlightNodesWithEntry(this.blackboard.state.activeEntryId);
        }
    }
    renderDHTHelp() {
        return html `
      <mwc-dialog id="dht-help" heading="DHT Help">
        <span>
          This is a visual interactive representation of a holochain
          <a
            href="https://developer.holochain.org/docs/concepts/4_public_data_on_the_dht/"
            target="_blank"
            >DHT</a
          >, with ${this.blackboard.state.conductors.length} nodes.
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
        return html `${this.renderDHTHelp()}
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
__decorate([
    query('#dht-help'),
    __metadata("design:type", Dialog)
], DHTGraph.prototype, "dhtHelp", void 0);
customElements.define('holochain-playground-dht-graph', DHTGraph);

export { DHTGraph };
//# sourceMappingURL=holochain-playground-dht-graph.js.map
