import { LitElement, html, query, css, property } from 'lit-element';
import cytoscape from 'cytoscape';
import { MenuSurface } from 'scoped-material-components/mwc-menu-surface';
import { Button } from 'scoped-material-components/mwc-button';
import { Hash } from '@holochain-open-dev/core-types';
import {
  Cell,
  sleep,
  NetworkRequestType,
  WorkflowType,
} from '@holochain-playground/core';
import { Card } from 'scoped-material-components/mwc-card';
import { Slider } from 'scoped-material-components/mwc-slider';
import { Switch } from 'scoped-material-components/mwc-switch';
import { CellTasks } from '../helpers/cell-tasks';
import { HelpButton } from '../helpers/help-button';
import { PlaygroundElement } from '../../context/playground-element';
import { selectAllCells, selectHoldingCells } from '../utils/selectors';
import { sharedStyles } from '../utils/shared-styles';
import { dhtCellsNodes, neighborsEdges } from './processors';
import { graphStyles, layoutConfig } from './graph';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { styleMap } from 'lit-html/directives/style-map';
import { Formfield } from 'scoped-material-components/mwc-formfield';
import { Icon } from 'scoped-material-components/mwc-icon';
import { Subject } from 'rxjs';

const MIN_ANIMATION_DELAY = 1000;
const MAX_ANIMATION_DELAY = 7000;

export class DhtCells extends PlaygroundElement {
  @property({ type: Number })
  animationDelay: number = 2000;

  @property({ type: Array })
  workflowsToDisplay: WorkflowType[] = [
    WorkflowType.GENESIS,
    WorkflowType.CALL_ZOME,
    WorkflowType.INCOMING_DHT_OPS,
    WorkflowType.INTEGRATE_DHT_OPS,
    WorkflowType.PRODUCE_DHT_OPS,
    WorkflowType.PUBLISH_DHT_OPS,
    WorkflowType.APP_VALIDATION,
    WorkflowType.SYS_VALIDATION,
  ];

  @property({ type: Array })
  networkRequestsToDisplay: NetworkRequestType[] = [
    NetworkRequestType.ADD_NEIGHBOR,
    NetworkRequestType.PUBLISH_REQUEST,
    NetworkRequestType.CALL_REMOTE,
    NetworkRequestType.GET_REQUEST,
  ];

  @property({ type: Boolean, attribute: 'hide-time-controller' })
  hideTimeController: boolean = false;

  @query('#graph')
  private _graph: any;

  private _cy;
  private _layout;

  private _resumeObservable = new Subject();

  @property({ type: Boolean, attribute: 'paused' })
  pauseOnNextStep = false;

  @property({ type: Boolean })
  private _onPause = false;

  async firstUpdated() {
    window.addEventListener('scroll', () => {
      this._cy.resize();
      this.requestUpdate();
    });

    this._cy = cytoscape({
      container: this._graph,
      boxSelectionEnabled: false,
      autoungrabify: true,
      userPanningEnabled: false,
      userZoomingEnabled: false,
      layout: layoutConfig,
      style: graphStyles,
    });

    this._cy.on('tap', 'node', (evt) => {
      this.updatePlayground({
        activeAgentPubKey: evt.target.id(),
        activeEntryHash: null,
      });
    });
  }

  highlightNodesWithEntry(entryHash: Hash) {
    const allCells = selectAllCells(this.activeDna, this.conductors);

    allCells.forEach((cell) =>
      this._cy.getElementById(cell.agentPubKey).removeClass('highlighted')
    );
    const holdingCells = selectHoldingCells(entryHash, allCells);

    for (const cell of holdingCells) {
      this._cy.getElementById(cell.agentPubKey).addClass('highlighted');
    }
  }

  observedCells() {
    return selectAllCells(this.activeDna, this.conductors);
  }

  onNewObservedCell(cell: Cell) {
    return [
      cell.p2p.networkRequestsExecutor.before(async (networkRequest) => {
        this.requestUpdate();

        if (!this.networkRequestsToDisplay.includes(networkRequest.type))
          return;
        if (networkRequest.toAgent === networkRequest.fromAgent) return;

        const fromNode = this._cy.getElementById(networkRequest.fromAgent);
        if (!fromNode.position()) return;
        const toNode = this._cy.getElementById(networkRequest.toAgent);

        const fromPosition = fromNode.position();
        const toPosition = toNode.position();
        const el = this._cy.add([
          {
            group: 'nodes',
            data: {
              networkRequest,
              label: networkRequest.type,
            },
            position: { x: fromPosition.x + 1, y: fromPosition.y + 1 },
            classes: ['network-request'],
          },
        ]);

        if (this.pauseOnNextStep) {
          const halfPosition = {
            x: (toPosition.x - fromPosition.x) / 2 + fromPosition.x,
            y: (toPosition.y - fromPosition.y) / 2 + fromPosition.y,
          };
          el.animate({
            position: halfPosition,
            duration: this.animationDelay / 2,
          });

          await sleep(this.animationDelay / 2);

          this._onPause = true;
          await new Promise((resolve) =>
            this._resumeObservable.subscribe(() => resolve(null))
          );
          this._onPause = false;

          el.animate({
            position: toPosition,
            duration: this.animationDelay / 2,
          });

          await sleep(this.animationDelay / 2);
        } else {
          el.animate({
            position: toNode.position(),
            duration: this.animationDelay,
          });

          await sleep(this.animationDelay);
        }
        this._cy.remove(el);
      }),
    ];
  }

  onCellsChanged() {
    if (this._layout) this._layout.stop();
    this._cy.remove('node');
    this._cy.remove('edge');

    const nodes = dhtCellsNodes(this._observedCells);
    this._cy.add(nodes);
    const neighbors = neighborsEdges(this._observedCells);
    this._cy.add(neighbors);

    this._layout = this._cy.elements().makeLayout(layoutConfig);
    this._layout.run();
  }

  _neighborEdges = [];

  updated(changedValues) {
    super.updated(changedValues);

    const neighbors = neighborsEdges(this._observedCells);
    if (this._neighborEdges.length != neighbors.length) {
      this._neighborEdges = neighbors;
      this._cy.add(neighbors);
    }

    this.observedCells().forEach((cell) =>
      this._cy.getElementById(cell.agentPubKey).removeClass('selected')
    );
    this._cy.getElementById(this.activeAgentPubKey).addClass('selected');

    this.highlightNodesWithEntry(this.activeEntryHash);
  }

  renderTimeController() {
    if (this.hideTimeController) return html``;

    return html`
      <div class="row center-content">
        <mwc-slider
          .value=${MAX_ANIMATION_DELAY - this.animationDelay}
          pin
          .min=${MIN_ANIMATION_DELAY}
          .max=${MAX_ANIMATION_DELAY}
          @change=${(e) =>
            (this.animationDelay = MAX_ANIMATION_DELAY - e.target.value)}
        ></mwc-slider>
        <mwc-icon style="margin: 0 16px;">speed</mwc-icon>

        <span
          class="vertical-divider"
          style="height: 60%; margin: 0 8px;"
        ></span>

        <mwc-icon-button
          .disabled=${this.pauseOnNextStep}
          icon="pause"
          @click=${() => (this.pauseOnNextStep = true)}
        ></mwc-icon-button>

        <mwc-icon-button
          .disabled=${!this._onPause}
          icon="skip_next"
          @click=${() => {
            this._resumeObservable.next();
            this.pauseOnNextStep = true;
          }}
        ></mwc-icon-button>
        <mwc-icon-button
          .disabled=${!this._onPause}
          icon="fast_forward"
          @click=${() => {
            this._resumeObservable.next();
            this.pauseOnNextStep = false;
          }}
        ></mwc-icon-button>
      </div>
    `;
  }

  renderHelp() {
    return html`
      <holochain-playground-help-button heading="DHT Cells" class="block-help">
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
    if (!this._cy || !this._observedCells) return html``;

    const nodes = this._cy.nodes();
    const cellsWithPosition = nodes.map((node) => {
      const agentPubKey = node.id();
      const cell = this._observedCells.find(
        (cell) => cell.agentPubKey === agentPubKey
      );

      return { cell, position: node.renderedPosition() };
    });

    return html`${cellsWithPosition.map(({ cell, position }) => {
      const leftSide = this._cy.width() / 2 > position.x;
      const upSide = this._cy.height() / 2 > position.y;

      const finalX = position.x + (leftSide ? -250 : 50);
      const finalY = position.y + (upSide ? -50 : 50);

      return html`<holochain-playground-cell-tasks
        .workflowsToDisplay=${this.workflowsToDisplay}
        .workflowDelay=${this.animationDelay}
        .cell=${cell}
        style=${styleMap({
          top: `${finalY}px`,
          left: `${finalX}px`,
          position: 'absolute',
          'z-index': '100',
        })}
        ._pauseOnNextStep=${this.pauseOnNextStep}
        ._onPause=${this._onPause}
        ._resumeObservable=${this._resumeObservable}
        @execution-paused=${(e) => (this._onPause = e.detail.paused)}
      >
      </holochain-playground-cell-tasks>`;
    })}`;
  }

  renderCopyButton() {
    if (!this.activeAgentPubKey) return html``;

    const el = this._cy.getElementById(this.activeAgentPubKey);
    const pos = el.renderedPosition();
    return html`<mwc-icon-button
      style=${styleMap({
        position: 'absolute',
        top: `${pos.y - 2}px`,
        left: `${pos.x + 63}px`,
        'z-index': '10',
      })}
      icon="content_copy"
      @click=${() => {
        navigator.clipboard.writeText(this.activeAgentPubKey);
        this.dispatchEvent(
          new CustomEvent('show-message', {
            detail: { message: 'AgentPubKey copied to the clipboard' },
            bubbles: true,
            composed: true,
          })
        );
      }}
    ></mwc-icon-button>`;
  }

  render() {
    return html`
      <mwc-card class="block-card" style="position: relative;">
        ${this.renderHelp()} ${this.renderTasksTooltips()}
        ${this.renderCopyButton()}
        <div
          class="column fill"
          style=${styleMap({
            'background-color': this._onPause ? 'lightgrey' : 'white',
            opacity: this._onPause ? '0.6' : '1',
          })}
        >
          <span class="block-title" style="margin: 16px;">DHT Cells</span>
          <div id="graph" class="fill"></div>
          <div class="row" style="margin: 16px;">
            <span style="flex: 1;"></span>
            ${this.renderTimeController()}
          </div>
        </div>
      </mwc-card>
    `;
  }

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

  static get scopedElements() {
    return {
      'mwc-card': Card,
      'mwc-menu-surface': MenuSurface,
      'mwc-button': Button,
      'mwc-icon': Icon,
      'mwc-slider': Slider,
      'mwc-switch': Switch,
      'mwc-formfield': Formfield,
      'mwc-icon-button': IconButton,
      'holochain-playground-help-button': HelpButton,
      'holochain-playground-cell-tasks': CellTasks,
    };
  }
}
