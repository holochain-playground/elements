import { property, html, PropertyValues, css, query } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { sourceChainNodes } from '../processors/graph';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import { isEqual } from 'lodash-es';

import { sharedStyles } from './utils/shared-styles';

import { Cell } from '@holochain-playground/core';
import { selectCell } from './utils/selectors';
import { PlaygroundElement } from '../context/playground-element';
import { Card } from 'scoped-material-components/mwc-card';
import { HelpButton } from './helpers/help-button';

cytoscape.use(dagre); // register extension

export class SourceChain extends PlaygroundElement {
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

  get activeCell(): Cell | undefined {
    return selectCell(this.activeDna, this.activeAgentPubKey, this.conductors);
  }

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
          shape: round-rectangle;
        }

        edge {
          width: 4;
          target-arrow-shape: triangle;
          curve-style: bezier;
          line-style: dotted;
        }

        .selected {
          border-width: 4px;
          border-color: black;
          border-style: solid;
        }

        .Dna {
          background-color: green;
        }
        .AgentValidationPkg {
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
        activeEntryHash: selectedEntryId,
      });
    });
    this.cy.renderer().hoverData.capture = true;

    this.requestUpdate();
  }

  observedCells() {
    return [this.activeCell];
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    const nodes = sourceChainNodes(this.activeCell);
    if (!isEqual(nodes, this.nodes)) {
      this.cy.remove('node');
      this.cy.add(nodes);

      if (this.nodes.length === 0) {
        const tipNodes = nodes.slice(0, 7);

        this.cy.fit(tipNodes);
        this.cy.center(tipNodes);
        this.cy.resize();
      }

      this.cy.layout({ name: 'dagre' }).run();

      this.nodes = nodes;
    }

    this.cy.filter('node').removeClass('selected');

    const nodeElements = this.cy.nodes();

    for (const nodeElement of nodeElements) {
      if (nodeElement.id().includes(this.activeEntryHash)) {
        nodeElement.addClass('selected');
      }
    }

    this.cy.renderer().hoverData.capture = true;
  }

  renderHelp() {
    return html` <holochain-playground-help-button
      heading="Source-Chain"
      class="block-help"
    >
      <span>
        This graph displays the source chain of the selected cell. On the
        top-left sequence, you can see the hash-chain of headers. On the
        bottom-right sequence, you can see the entries associated with each
        header. Links between headers
        <br />
        <br />
        Dashed relationships are embedded references: the headers contain the
        hash of the last header, and also the entry hash if they have an entry.
      </span>
    </holochain-playground-help-button>`;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        <div class="column fill">
          <span class="block-title" style="margin: 16px;">Source chain</span>
          ${this.renderHelp()}
          ${this.activeCell
            ? html``
            : html`
                <div style="flex: 1;" class="center-content placeholder">
                  <span>Select a cell to display its source chain</span>
                </div>
              `}

          <div
            style=${styleMap({
              display: this.activeCell ? '' : 'none',
            })}
            class="fill"
            id="source-chain-graph"
          ></div>
        </div>
      </mwc-card>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-card': Card,
      'holochain-playground-help-button': HelpButton,
    };
  }
}
