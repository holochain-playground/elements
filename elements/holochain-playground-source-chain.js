import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import { isEqual } from 'lodash-es';
import 'blakejs';
import 'byte-base64';
import '../processors/hash.js';
import '../types/entry.js';
import '../types/timestamp.js';
import '../types/metadata.js';
import '../core/cell/dht/get.js';
import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { LitElement, css, html, property, query } from 'lit-element';
import '@alenaksu/json-viewer';
import { sharedStyles } from './sharedStyles.js';
import { sourceChainNodes } from '../processors/graph.js';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';
import { selectActiveCell } from '../state/selectors.js';
import popper from 'cytoscape-popper';

cytoscape.use(dagre); // register extension
cytoscape.use(popper);
class SourceChain extends blackboardConnect('holochain-playground', LitElement) {
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
    firstUpdated() {
        this.cy = cytoscape({
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
            this.blackboard.update('activeEntryId', selectedEntryId);
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
        const cell = selectActiveCell(this.blackboard.state);
        if (cell != this._cell) {
            if (this._subscription)
                this._subscription.unsubscribe();
            this._subscription = cell.signals['after-workflow-executed'].subscribe(() => this.requestUpdate());
            this._cell = cell;
        }
        const nodes = sourceChainNodes(cell);
        if (!isEqual(nodes, this.nodes)) {
            this.nodes = nodes;
            this.cy.remove('nodes');
            this.cy.add(nodes);
            this.cy.layout({ name: 'dagre' }).run();
        }
        this.cy.filter('node').removeClass('selected');
        this.cy
            .getElementById(this.blackboard.state.activeEntryId)
            .addClass('selected');
    }
    render() {
        return html `
      <mwc-menu-surface id="node-info-menu">
        <json-viewer .data=${this._nodeInfo}></json-viewer>
      </mwc-menu-surface>
      <div style="width: 400px; height: 95%;" id="source-chain-graph"></div>
    `;
    }
}
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], SourceChain.prototype, "_nodeInfo", void 0);
__decorate([
    query('#node-info-menu'),
    __metadata("design:type", MenuSurface)
], SourceChain.prototype, "_nodeInfoMenu", void 0);
customElements.define('holochain-playground-source-chain', SourceChain);

export { SourceChain };
//# sourceMappingURL=holochain-playground-source-chain.js.map
