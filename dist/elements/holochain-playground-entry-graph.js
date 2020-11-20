import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import 'lodash-es';
import '../processors/hash.js';
import 'byte-base64';
import '../types/entry.js';
import '../types/timestamp.js';
import '../types/metadata.js';
import '../core/cell/dht/get.js';
import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { LitElement, html, css, property, query } from 'lit-element';
import { Dialog } from '@material/mwc-dialog';
import { sharedStyles } from './sharedStyles.js';
import { allEntries } from '../processors/graph.js';
import * as cytoscape from 'cytoscape';
import { use } from 'cytoscape';
import { selectActiveCells } from '../state/selectors.js';
import { vectorsEqual } from '../processors/utils.js';
import * as cola from 'cytoscape-cola';
import '@material/mwc-checkbox';

use(cola);
const layoutConfig = {
    name: 'cola',
    handleDisconnected: true,
    animate: true,
    avoidOverlap: true,
    infinite: false,
    unconstrIter: 1,
    userConstIter: 0,
    allConstIter: 1,
    ready: (e) => {
        e.cy.fit();
        e.cy.center();
    },
};
class EntryGraph extends blackboardConnect('holochain-playground', LitElement) {
    constructor() {
        super(...arguments);
        this.showAgentsIds = true;
        this.lastEntriesIds = [];
        this.ready = false;
    }
    firstUpdated() {
        this.cy = cytoscape({
            container: this.entryGraph,
            boxSelectionEnabled: false,
            autoungrabify: false,
            userZoomingEnabled: true,
            userPanningEnabled: true,
            layout: layoutConfig,
            style: `
              node {
                background-color: grey;
                font-size: 10px;
                width: 16px;
                label: data(label);
                height: 16px;
              }
      
              edge {
                label: data(label);
                width: 2;
                target-arrow-shape: triangle;
                curve-style: bezier;
              }
              
              edge[label] {
                font-size: 7px;
                text-rotation: autorotate;
                text-margin-x: 0px;
                text-margin-y: -5px;
                text-valign: top;
                text-halign: center;        
              }
      
              .selected {
                border-width: 1px;
                border-color: black;
                border-style: solid;
              }
      
              .DNA {
                background-color: green;
              }
              .AgentId {
                background-color: lime;
              }
              .CreateEntry {
                background-color: blue;
              }
              .RemoveEntry {
                background-color: red;
              }
              .UpdateEntry {
                background-color: cyan;
              }
              .LinkAdd {
                background-color: purple;
              }
              .LinkRemove {
                background-color: purple;
              }
      
              .implicit {
                width: 1;
                line-style: dotted;
              }

              .update-link {
                width: 1;
                line-style: dashed;
              }
              .updated {
                opacity: 0.5;
              }
              .deleted {
                opacity: 0.3;
              }
            `,
        });
        this.cy.on('tap', 'node', (event) => {
            const selectedEntryId = event.target.id();
            this.blackboard.update('activeEntryId', selectedEntryId);
        });
        this.cy.ready((e) => {
            setTimeout(() => {
                this.ready = true;
                this.updatedGraph();
            }, 250);
        });
    }
    updated(changedValues) {
        super.updated(changedValues);
        this.updatedGraph();
    }
    renderEntryGraphHelp() {
        return html `
      <mwc-dialog id="entry-graph-help" heading="Entry Graph Help">
        <span>
          This graph contains a
          <strong>high-level view of all the entries</strong> that are present
          in the DHT. Every circle you see represents an entry, and you can
          click on it if you want to see its details.
          <br />
          <br />
          You can create new entries in the right panel with sample content, and
          link between them. All relationships between entries will show up in
          the graph.
          <br />
          <br />
          Green entries are "AgentId" entries. These entries are automatically
          created when a node boots up and joins the network, and are the
          entries from/to which we link when we specify "%agent_id". If you want
          to hide the AgentId entries that have no links, uncheck the button
          below.
        </span>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
    }
    updatedGraph() {
        if (this.entryGraph.getBoundingClientRect().width === 0 || !this.ready)
            return null;
        const entries = allEntries(selectActiveCells(this.blackboard.state), this.showAgentsIds);
        if (!vectorsEqual(this.lastEntriesIds, entries.map((e) => e.data.id))) {
            if (this.layout)
                this.layout.stop();
            this.cy.remove('nodes');
            this.cy.add(entries);
            this.layout = this.cy.elements().makeLayout(layoutConfig);
            this.layout.run();
        }
        this.lastEntriesIds = entries.map((e) => e.data.id);
        this.cy.filter('node').removeClass('selected');
        this.cy
            .getElementById(this.blackboard.state.activeEntryId)
            .addClass('selected');
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
    render() {
        return html `
      ${this.renderEntryGraphHelp()}
      <mwc-card style="width: auto; position: relative;" class="fill">
        <div class="column fill">
          <h3 class="title" style="margin-left: 16px; margin-top: 16px;">
            Entry Graph
          </h3>

          <div id="entry-graph" class="fill"></div>

          <mwc-icon-button
            style="position: absolute; right: 8px; top: 8px;"
            icon="help_outline"
            @click=${() => (this.entryGraphHelp.open = true)}
          ></mwc-icon-button>

          <div class="row" style="align-items: end;">
            <mwc-formfield label="Show all AgentId entries">
              <mwc-checkbox
                checked
                @change=${() => (this.showAgentsIds = !this.showAgentsIds)}
              ></mwc-checkbox
            ></mwc-formfield>
          </div>
        </div>
      </mwc-card>
    `;
    }
}
__decorate([
    property({ attribute: false }),
    __metadata("design:type", Boolean)
], EntryGraph.prototype, "showAgentsIds", void 0);
__decorate([
    query('#entry-graph-help'),
    __metadata("design:type", Dialog)
], EntryGraph.prototype, "entryGraphHelp", void 0);
__decorate([
    query('#entry-graph'),
    __metadata("design:type", HTMLElement)
], EntryGraph.prototype, "entryGraph", void 0);
customElements.define('holochain-playground-entry-graph', EntryGraph);

export { EntryGraph };
//# sourceMappingURL=holochain-playground-entry-graph.js.map
