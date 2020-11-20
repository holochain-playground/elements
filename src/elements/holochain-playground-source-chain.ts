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
import * as cytoscape from 'cytoscape';
import * as dagre from 'cytoscape-dagre';
import '@material/mwc-menu/mwc-menu-surface';
import '@alenaksu/json-viewer';

import { isEqual } from 'lodash-es';

import { sharedStyles } from './sharedStyles';
import { Playground } from '../state/playground';
import { blackboardConnect } from '../blackboard/blackboard-connect';
import { selectActiveCell } from '../state/selectors';
import { Cell } from '../core/cell';
import { Subscription } from 'rxjs';
import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';

cytoscape.use(dagre); // register extension

export class SourceChain extends blackboardConnect<Playground>(
  'holochain-playground',
  LitElement
) {
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

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    const cell = selectActiveCell(this.blackboard.state);

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

    this.cy
      .getElementById(this.blackboard.state.activeEntryId)
      .addClass('selected');
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
