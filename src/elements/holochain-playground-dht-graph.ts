import { LitElement, html, query, css, property } from 'lit-element';
import cytoscape from 'cytoscape';
import { MenuSurface } from 'scoped-material-components/mwc-menu-surface';
import { Button } from 'scoped-material-components/mwc-button';
import { Hash } from '@holochain-open-dev/core-types';
import { AgentPubKey } from '@holochain-open-dev/core-types';

import { dnaNodes } from '../processors/graph';
import { selectAllCells, selectHoldingCells } from './utils/selectors';
import { sharedStyles } from './utils/shared-styles';
import { BaseElement } from './utils/base-element';
import { isEqual } from 'lodash-es';
import { HolochainPlaygroundHelpButton } from './helpers/holochain-playground-help-button';
import { Card } from 'scoped-material-components/mwc-card';
import { Cell, Task } from '@holochain-playground/core';
import { HolochainPlaygroundCellTasks } from './helpers/holochain-playground-cell-tasks';

const layoutConfig = {
  name: 'circle',
  padding: 60,
  ready: (e) => {
    e.cy.resize();
    e.cy.fit();
    e.cy.center();
  },
};

export interface TaskInfo {
  task: Task<any>;
  cell: Cell;
}

export class HolochainPlaygroundDhtGraph extends BaseElement {
  @query('#graph')
  private graph: any;

  private lastNodes: AgentPubKey[] = [];

  private cy;
  private layout;

  @property({ type: Array })
  private _cells: Array<Cell> = [];

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
    window.addEventListener('scroll', () => {
      this.cy.resize();
    });

    this.cy = cytoscape({
      container: this.graph,
      boxSelectionEnabled: false,
      autoungrabify: true,
      userPanningEnabled: false,
      userZoomingEnabled: false,
      layout: layoutConfig,
      style: `
            node {
              background-color: lightblue;
              border-color: black;
              border-width: 2px;
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
      this.updatePlayground({
        activeAgentPubKey: evt.target.id(),
        activeEntryHash: null,
      });
    });
  }

  highlightNodesWithEntry(entryHash: Hash) {
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
    if (!isEqual(this.lastNodes, newAgentIds)) {
      this._cells = cells;
      this._cells.forEach((cell) => this.subscribeToCell(cell));

      if (this.layout) this.layout.stop();
      this.cy.remove('nodes');

      const nodes = dnaNodes(this._cells);
      this.cy.add(nodes);

      this.layout = this.cy.elements().makeLayout(layoutConfig);
      this.layout.run();
      this.lastNodes = newAgentIds;
    }

    this._cells.forEach((cell) =>
      this.cy.getElementById(cell.agentPubKey).removeClass('selected')
    );
    this.cy.getElementById(this.activeAgentPubKey).addClass('selected');

    this.highlightNodesWithEntry(this.activeEntryHash);
  }

  renderHelp() {
    return html`
      <holochain-playground-help-button heading="DHT Graph" class="block-help">
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
      </holochain-playground-help-button>
    `;
  }

  renderTasksTooltips() {
    if (!this.cy || !this._cells) return html``;

    const nodes = this.cy.nodes();
    const cellsWithPosition = nodes.map((node) => {
      const agentPubKey = node.id();
      const cell = this._cells.find((cell) => cell.agentPubKey === agentPubKey);

      return { cell, position: node.renderedPosition() };
    });

    return html`${cellsWithPosition.map(({ cell, position }) => {
      return html`<holochain-playground-cell-tasks
        .cell=${cell}
        .x=${position.x}
        .y=${position.y}
      >
      </holochain-playground-cell-tasks>`;
    })}`;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        ${this.renderHelp()} ${this.renderTasksTooltips()}
        <div class="column fill">
          <h3 class="block-title">DHT Nodes</h3>
          <div id="graph" class="fill"></div>
        </div>
      </mwc-card>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-card': Card,
      'mwc-menu-surface': MenuSurface,
      'mwc-button': Button,
      'holochain-playground-help-button': HolochainPlaygroundHelpButton,
      'holochain-playground-cell-tasks': HolochainPlaygroundCellTasks,
    };
  }
}
