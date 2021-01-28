import { LitElement, html, query, css, property } from 'lit-element';
import cytoscape from 'cytoscape';
import { MenuSurface } from 'scoped-material-components/mwc-menu-surface';
import { Button } from 'scoped-material-components/mwc-button';
import { Hash } from '@holochain-open-dev/core-types';
import { Cell, sleep } from '@holochain-playground/core';
import { Card } from 'scoped-material-components/mwc-card';
import { HolochainPlaygroundCellTasks } from '../helpers/holochain-playground-cell-tasks';
import { HolochainPlaygroundHelpButton } from '../helpers/holochain-playground-help-button';
import { BaseElement } from '../utils/base-element';
import { selectAllCells, selectHoldingCells } from '../utils/selectors';
import { sharedStyles } from '../utils/shared-styles';
import { dhtCellsNodes, neighborsEdges } from './processors';
import { graphStyles, layoutConfig } from './graph';

export class HolochainPlaygroundDhtCells extends BaseElement {
  @query('#graph')
  private graph: any;

  private cy;
  private layout;

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
      this.requestUpdate();
    });

    this.cy = cytoscape({
      container: this.graph,
      boxSelectionEnabled: false,
      autoungrabify: true,
      userPanningEnabled: false,
      userZoomingEnabled: false,
      layout: layoutConfig,
      style: graphStyles,
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

  observedCells() {
    return selectAllCells(this.activeDna, this.conductors);
  }

  onNewObservedCell(cell: Cell) {
    return [
      cell.p2p.networkRequestsExecutor.before(async (networkRequest) => {
        this.requestUpdate();
        if (networkRequest.toAgent === networkRequest.fromAgent) return;

        const duration = 3000;

        const fromNode = this.cy.getElementById(networkRequest.fromAgent);
        if (!fromNode.position()) return;
        const toNode = this.cy.getElementById(networkRequest.toAgent);

        const fromPosition = fromNode.position();
        const toPosition = toNode.position();
        const el = this.cy.add([
          {
            group: 'nodes',
            data: {
              networkRequest,
              label: networkRequest.name,
            },
            position: { x: fromPosition.x + 1, y: fromPosition.y + 1 },
            classes: ['network-request'],
          },
        ]);

        el.animate({
          position: toNode.position(),
          duration: duration,
        });

        await sleep(duration);
        this.cy.remove(el);
      }),
    ];
  }

  onCellsChanged() {
    if (this.layout) this.layout.stop();
    this.cy.remove('node');
    this.cy.remove('edge');

    const nodes = dhtCellsNodes(this.cells);
    this.cy.add(nodes);
    const neighbors = neighborsEdges(this.cells);
    this.cy.add(neighbors);

    this.layout = this.cy.elements().makeLayout(layoutConfig);
    this.layout.run();
  }

  _neighborEdges = [];

  updated(changedValues) {
    super.updated(changedValues);

    const neighbors = neighborsEdges(this.cells);
    if (this._neighborEdges.length != neighbors.length) {
      this._neighborEdges = neighbors;
      this.cy.add(neighbors);
    }

    this.observedCells().forEach((cell) =>
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
    if (!this.cy || !this.cells) return html``;

    const nodes = this.cy.nodes();
    const cellsWithPosition = nodes.map((node) => {
      const agentPubKey = node.id();
      const cell = this.cells.find((cell) => cell.agentPubKey === agentPubKey);

      return { cell, position: node.renderedPosition() };
    });

    return html`${cellsWithPosition.map(({ cell, position }) => {
      const leftSide = this.cy.width() / 2 > position.x;
      const upSide = this.cy.height() / 2 > position.y;

      const finalX = position.x + (leftSide ? -250 : 50);
      const finalY = position.y + (upSide ? -50 : 50);

      return html`<holochain-playground-cell-tasks
        .cell=${cell}
        .x=${finalX}
        .y=${finalY}
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
