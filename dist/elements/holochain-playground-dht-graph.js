import '../types/common.js';
import '../processors/hash.js';
import 'byte-base64';
import '../types/entry.js';
import '../types/header.js';
import '../types/timestamp.js';
import '../core/cell/source-chain/utils.js';
import '../core/cell/source-chain/builder-headers.js';
import '../core/cell/source-chain/put.js';
import '../types/dht-op.js';
import '../core/cell/source-chain/get.js';
import '../core/cell/workflows/publish_dht_ops.js';
import '../core/cell/workflows/produce_dht_ops.js';
import '../core/cell/workflows/genesis.js';
import '../executor/immediate-executor.js';
import '../core/cell/workflows/call_zome_fn.js';
import '../types/cell-state.js';
import '../types/metadata.js';
import 'lodash-es';
import '../core/cell/dht/get.js';
import '../core/cell/dht/put.js';
import '../core/cell/workflows/integrate_dht_ops.js';
import '../core/cell/workflows/app_validation.js';
import '../core/cell/workflows/sys_validation.js';
import '../core/cell/workflows/incoming_dht_ops.js';
import 'rxjs';
import '../core/cell.js';
import '../core/network/p2p-cell.js';
import '../core/network.js';
import '../core/conductor.js';
import '../core/cell/source-chain/actions.js';
import '../dnas/sample-dna.js';
import { U as UpdateContextEvent, _ as __decorate, a as __metadata, c as consumePlayground } from '../context-97eb5dfe.js';
import { LitElement, css, html, property, query } from 'lit-element';
import { Dialog } from '@material/mwc-dialog';
import { sharedStyles } from './utils/sharedStyles.js';
import { dnaNodes } from '../processors/graph.js';
import * as cytoscape from 'cytoscape';
import 'lit-context';
import '@material/mwc-snackbar';
import '@material/mwc-circular-progress';
import '../processors/message.js';
import '../processors/create-conductors.js';
import '../processors/build-simulated-playground.js';
import { selectAllCells, selectHoldingCells } from './utils/selectors.js';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import { vectorsEqual } from '../processors/utils.js';

let DHTGraph = class DHTGraph extends LitElement {
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
            this.dispatchEvent(new UpdateContextEvent({
                activeAgentPubKey: evt.target.id(),
                activeEntryHash: null,
            }));
        });
    }
    highlightNodesWithEntry(entryHash) {
        const allCells = selectAllCells(this.activeDna, this.conductors);
        allCells.forEach((cell) => this.cy.getElementById(cell.agentPubKey).removeClass('highlighted'));
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
            if (this.layout)
                this.layout.stop();
            this.cy.remove('nodes');
            const nodes = dnaNodes(cells);
            this.cy.add(nodes);
            this.layout = this.cy.elements().makeLayout({ name: 'circle' });
            this.layout.run();
            this.lastNodes = newAgentIds;
        }
        cells.forEach((cell) => this.cy.getElementById(cell.agentPubKey).removeClass('selected'));
        this.cy.getElementById(this.activeAgentPubKey).addClass('selected');
        this.highlightNodesWithEntry(this.activeEntryHash);
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
};
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], DHTGraph.prototype, "activeDna", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], DHTGraph.prototype, "conductors", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], DHTGraph.prototype, "activeEntryHash", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], DHTGraph.prototype, "activeAgentPubKey", void 0);
__decorate([
    query('#dht-help'),
    __metadata("design:type", Dialog)
], DHTGraph.prototype, "dhtHelp", void 0);
__decorate([
    query('#graph'),
    __metadata("design:type", Object)
], DHTGraph.prototype, "graph", void 0);
DHTGraph = __decorate([
    consumePlayground()
], DHTGraph);
customElements.define('holochain-playground-dht-graph', DHTGraph);

export { DHTGraph };
//# sourceMappingURL=holochain-playground-dht-graph.js.map
