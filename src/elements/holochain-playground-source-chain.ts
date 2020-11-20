import {
  LitElement,
  property,
  html,
  PropertyValues,
  css,
  unsafeCSS,
  query,
} from 'lit-element';
import { sourceChainNodes } from '../processors/graph';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import '@material/mwc-menu/mwc-menu-surface';
import '@alenaksu/json-viewer';

import { isEqual } from 'lodash-es';

import { sharedStyles } from './utils/sharedStyles';
import { Cell } from '../core/cell';
import { Subscription } from 'rxjs';
import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';
import { consumePlayground, UpdateContextEvent } from './utils/context';
import { Conductor } from '../core/conductor';
import { selectCell } from './utils/selectors';

cytoscape.use(dagre); // register extension

@consumePlayground()
export class SourceChain extends LitElement {
  @property({ type: String })
  private activeDna: string | undefined;
  @property({ type: Array })
  private conductors: Conductor[] | undefined;
  @property({ type: String })
  private activeAgentPubKey: string | undefined;
  @property({ type: String })
  private activeEntryHash: string | undefined;

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

  private cy: cytoscape.Core;

  private nodes: any[] = [];

  private _cell: Cell;
  private _subscription: Subscription;

  @property({ type: Object })
  private _nodeInfo: any | undefined = undefined;
  @query('#node-info-menu')
  private _nodeInfoMenu: MenuSurface;

  firstUpdated() {
    this.cy = cytoscape({
      provider: this.shadowRoot.getElementById('source-chain-graph'),
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
      this.dispatchEvent(
        new UpdateContextEvent({
          activeEntryHash: selectedEntryId,
        })
      );
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

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    const cell = selectCell(
      this.activeDna,
      this.activeAgentPubKey,
      this.conductors
    );

    if (cell != this._cell) {
      if (this._subscription) this._subscription.unsubscribe();

      this._subscription = cell.signals[
        'after-workflow-executed'
      ].subscribe(() => this.requestUpdate());
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

    this.cy.getElementById(this.activeEntryHash).addClass('selected');
  }

  render() {
    return html`
      <mwc-menu-surface id="node-info-menu">
        <json-viewer .data=${this._nodeInfo}></json-viewer>
      </mwc-menu-surface>
      <div style="width: 400px; height: 95%;" id="source-chain-graph"></div>
    `;
  }
}

customElements.define('holochain-playground-source-chain', SourceChain);
