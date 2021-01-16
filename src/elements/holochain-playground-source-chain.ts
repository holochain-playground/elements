import { property, html, PropertyValues, css, query } from 'lit-element';
import { sourceChainNodes } from '../processors/graph';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import '@alenaksu/json-viewer';

import { isEqual } from 'lodash-es';

import { sharedStyles } from './utils/shared-styles';

import { Subscription } from 'rxjs';
import { MenuSurface } from 'scoped-material-components/mwc-menu-surface';
import { Cell, Conductor } from '@holochain-playground/core';
import { selectAllCells, selectCell } from './utils/selectors';
import { BaseElement } from './utils/base-element';

cytoscape.use(dagre); // register extension

export class SourceChain extends BaseElement {
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

  get activeCell() {
    return (
      selectCell(this.activeDna, this.activeAgentPubKey, this.conductors) ||
      selectAllCells(this.activeDna, this.conductors)[0]
    );
  }

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
      this.updatePlayground({
        activeEntryHash: selectedEntryId,
      });
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

    if (this.activeCell != this._cell) {
      if (this._subscription) this._subscription.unsubscribe();

      this._subscription = this.activeCell.signals[
        'after-workflow-executed'
      ].subscribe(() => this.requestUpdate());
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
    return html`
      <mwc-menu-surface id="node-info-menu">
        <json-viewer .data=${this._nodeInfo}></json-viewer>
      </mwc-menu-surface>
      <div style="width: 400px; height: 95%;" id="source-chain-graph"></div>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-menu-surface': MenuSurface,
    };
  }
}
