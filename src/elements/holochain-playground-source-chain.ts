import { property, html, PropertyValues, css, query } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { sourceChainNodes } from '../processors/graph';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import { isEqual } from 'lodash-es';

import { sharedStyles } from './utils/shared-styles';

import { Subscription } from 'rxjs';
import { MenuSurface } from 'scoped-material-components/mwc-menu-surface';
import { Cell, Conductor } from '@holochain-playground/core';
import { selectAllCells, selectCell } from './utils/selectors';
import { BaseElement } from './utils/base-element';
import { JsonViewer } from '@power-elements/json-viewer';
import { deserializeHash } from '@holochain-open-dev/common';

cytoscape.use(dagre); // register extension

export class HolochainPlaygroundSourceChain extends BaseElement {
  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
        #source-chain-graph {
          width: 100%;
          height: 100%;
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
  @query('#source-chain-graph')
  private graph: HTMLElement;

  firstUpdated() {
    window.addEventListener('scroll', () => {
      this.cy.resize();
    });

    this.cy = cytoscape({
      container: this.graph,
      layout: {
        name: 'dagre',
        ready: (e) => {
          e.cy.fit();
          e.cy.center();
        },
      },
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
      // Node id is <HEADER_HASH>:<ENTRY_HASH>
      const selectedEntryId = event.target.id().split(':')[1];
      this.updatePlayground({
        activeEntryHash: deserializeHash(selectedEntryId),
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
    const activeCell = selectCell(
      this.activeDna,
      this.activeAgentPubKey,
      this.conductors
    );

    if (activeCell != this._cell) {
      if (this._subscription) this._subscription.unsubscribe();

      this._subscription = activeCell.signals[
        'after-workflow-executed'
      ].subscribe(() => this.requestUpdate());
      this._cell = activeCell;
    }

    const nodes = sourceChainNodes(activeCell);
    if (!isEqual(nodes, this.nodes)) {
      this.nodes = nodes;

      this.cy.remove('nodes');
      this.cy.add(nodes);
      this.cy.layout({ name: 'dagre' }).run();
    }

    this.cy.filter('node').removeClass('selected');
    this.cy.getElementById(this.activeEntryHash).addClass('selected');

    this.cy.renderer().hoverData.capture = true;
  }

  render() {
    return html`
      ${this._cell
        ? html``
        : html`
            <div style="flex: 1;" class="center-content">
              <span>Select a cell to display its source chain</span>
            </div>
          `}
      <mwc-menu-surface id="node-info-menu">
        <json-viewer .object=${this._nodeInfo} class="json-info"></json-viewer>
      </mwc-menu-surface>

      <div
        style=${styleMap({
          display: this._cell ? '' : 'none',
        })}
        id="source-chain-graph"
      ></div>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-menu-surface': MenuSurface,
      'json-viewer': JsonViewer,
    };
  }
}
