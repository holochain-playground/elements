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
import { isEqual } from 'lodash-es';
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
import '@alenaksu/json-viewer';
import { sharedStyles } from './utils/sharedStyles.js';
import { sourceChainNodes } from '../processors/graph.js';
import cytoscape__default from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';
import 'lit-context';
import '@material/mwc-snackbar';
import '@material/mwc-circular-progress';
import '../processors/message.js';
import '../processors/create-conductors.js';
import '../processors/build-simulated-playground.js';
import { selectCell, selectAllCells } from './utils/selectors.js';

cytoscape__default.use(dagre); // register extension
let SourceChain = class SourceChain extends LitElement {
    constructor() {
        super(...arguments);
        this.nodes = [];
        this._nodeInfo = undefined;
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
    get activeCell() {
        return (selectCell(this.activeDna, this.activeAgentPubKey, this.conductors) ||
            selectAllCells(this.activeDna, this.conductors)[0]);
    }
    firstUpdated() {
        this.cy = cytoscape__default({
            container: this.shadowRoot.getElementById('source-chain-graph'),
            layout: { name: 'dagre' },
            autoungrabify: true,
            userZoomingEnabled: true,
            userPanningEnabled: true,
            style: `
        node {
          width: 30px;
          height: 30px;
          font-size: 10px;
          label: data(label);
          background-color: grey;
          text-halign: right;
          text-valign: center;
          text-margin-x: 4px;
        }

        .header {
          text-margin-x: -5px;
          text-halign: left;
        }

        edge {
          width: 4;
          target-arrow-shape: triangle;
          curve-style: bezier;
        }

        .selected {
          border-width: 4px;
          border-color: black;
          border-style: solid;
        }

        .Dna {
          background-color: green;
        }
        .AgentId {
          background-color: lime;
        }
        .Create {
          background-color: blue;
        }
        .Delete {
          background-color: red;
        }
        .Update {
          background-color: cyan;
        }
        .CreateLink {
          background-color: purple;
        }
        .DeleteLink {
          background-color: purple;
        }
      `,
        });
        this.cy.on('tap', 'node', (event) => {
            const selectedEntryId = event.target.id();
            this.dispatchEvent(new UpdateContextEvent({
                activeEntryHash: selectedEntryId,
            }));
        });
        this.cy.renderer().hoverData.capture = true;
        this.cy.on('mouseover', 'node', (event) => {
            this._nodeInfo = event.target.data().data;
            this._nodeInfoMenu.x = event.originalEvent.x;
            this._nodeInfoMenu.y = event.originalEvent.y;
            this._nodeInfoMenu.open = true;
        });
        this.cy.on('mouseout', 'node', (event) => {
            this._nodeInfoMenu.open = false;
        });
        this.requestUpdate();
    }
    updated(changedValues) {
        super.updated(changedValues);
        if (this.activeCell != this._cell) {
            if (this._subscription)
                this._subscription.unsubscribe();
            this._subscription = this.activeCell.signals['after-workflow-executed'].subscribe(() => this.requestUpdate());
            this._cell = this.activeCell;
        }
        const nodes = sourceChainNodes(this.activeCell);
        console.log('ondes', nodes);
        if (!isEqual(nodes, this.nodes)) {
            this.nodes = nodes;
            this.cy.remove('nodes');
            this.cy.add(nodes);
            this.cy.layout({ name: 'dagre' }).run();
        }
        this.cy.filter('node').removeClass('selected');
        this.cy.getElementById(this.activeEntryHash).addClass('selected');
    }
    render() {
        return html `
      <mwc-menu-surface id="node-info-menu">
        <json-viewer .data=${this._nodeInfo}></json-viewer>
      </mwc-menu-surface>
      <div style="width: 400px; height: 95%;" id="source-chain-graph"></div>
    `;
    }
};
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], SourceChain.prototype, "activeDna", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], SourceChain.prototype, "conductors", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], SourceChain.prototype, "activeAgentPubKey", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], SourceChain.prototype, "activeEntryHash", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], SourceChain.prototype, "_nodeInfo", void 0);
__decorate([
    query('#node-info-menu'),
    __metadata("design:type", MenuSurface)
], SourceChain.prototype, "_nodeInfoMenu", void 0);
SourceChain = __decorate([
    consumePlayground()
], SourceChain);
customElements.define('holochain-playground-source-chain', SourceChain);

export { SourceChain };
//# sourceMappingURL=holochain-playground-source-chain.js.map
