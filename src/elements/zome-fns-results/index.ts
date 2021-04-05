import { LitElement, html, property, css } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { PlaygroundElement } from '../../context/playground-element';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { Card } from 'scoped-material-components/mwc-card';
import { sharedStyles } from '../utils/shared-styles';
import { Button } from 'scoped-material-components/mwc-button';
import { ZomeFunctionResult } from './types';
import { selectAllCells, selectCell } from '../utils/selectors';
import {
  CallZomeFnWorkflow,
  Cell,
  WorkflowType,
} from '@holochain-playground/core';
import { AgentPubKey, Dictionary } from '@holochain-open-dev/core-types';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { ExpandableLine } from '../helpers/expandable-line';
import { JsonViewer } from '@power-elements/json-viewer';
import { Icon } from 'scoped-material-components/mwc-icon';

export class ZomeFnsResults extends PlaygroundElement {
  @property({ type: Boolean, attribute: 'hide-agent-pub-key' })
  hideAgentPubKey = false;

  @property({ type: Array })
  // Results segmented by dnaHash/agentPubKey/timestamp
  _results: Dictionary<Dictionary<Dictionary<ZomeFunctionResult>>> = {};

  @property({ type: String, attribute: 'agent-name' })
  agentName: String | undefined = undefined;

  @property({ type: String, attribute: 'for-agent' })
  forAgent: AgentPubKey | undefined = undefined;

  get activeCell(): Cell {
    return selectCell(
      this.activeDna,
      this.forAgent ? this.forAgent : this.activeAgentPubKey,
      this.conductors
    );
  }

  observedCells() {
    if (this.forAgent)
      return [selectCell(this.activeDna, this.forAgent, this.conductors)];
    return selectAllCells(this.activeDna, this.conductors);
  }

  onNewObservedCell(cell: Cell) {
    return [
      cell.workflowExecutor.before(async (workflowInfo) => {
        if (workflowInfo.type === WorkflowType.CALL_ZOME) {
          const timestamp = Date.now().toString();
          const callZomeWorkflow = workflowInfo as CallZomeFnWorkflow;

          if (!this._results[cell.dnaHash]) this._results[cell.dnaHash] = {};
          if (!this._results[cell.dnaHash][cell.agentPubKey])
            this._results[cell.dnaHash][cell.agentPubKey] = {};

          this._results[cell.dnaHash][cell.agentPubKey][timestamp] = {
            cellId: cell.cellId,
            fnName: callZomeWorkflow.details.fnName,
            payload: callZomeWorkflow.details.payload,
            zome: callZomeWorkflow.details.zome,
            result: undefined,
          };
          (workflowInfo as any).timestamp = timestamp;
          this.requestUpdate();
        }
      }),
      cell.workflowExecutor.success(async (workflowInfo, result) => {
        if (
          workflowInfo.type === WorkflowType.CALL_ZOME &&
          (workflowInfo as any).timestamp
        ) {
          this._results[cell.dnaHash][cell.agentPubKey][
            (workflowInfo as any).timestamp
          ].result = { success: true, payload: result.result };
          this.requestUpdate();
        }
      }),
      cell.workflowExecutor.error(async (workflowInfo, error) => {
        if (
          workflowInfo.type === WorkflowType.CALL_ZOME &&
          (workflowInfo as any).timestamp
        ) {
          this._results[cell.dnaHash][cell.agentPubKey][
            (workflowInfo as any).timestamp
          ].result = { success: false, payload: error.message };
          this.requestUpdate();
        }
      }),
    ];
  }

  getActiveResults(): Array<[string, ZomeFunctionResult]> {
    if (!this.activeCell) return [];
    const dnaHash = this.activeCell.dnaHash;
    const agentPubKey = this.activeCell.agentPubKey;

    if (!(this._results[dnaHash] && this._results[dnaHash][agentPubKey]))
      return [];
    const results = this._results[dnaHash][agentPubKey];
    const sortedTimestamps = Object.keys(results).sort();
    const sortedResults = sortedTimestamps.map(
      (timestamp) =>
        [timestamp, results[timestamp]] as [string, ZomeFunctionResult]
    );

    return sortedResults;
  }
  renderResult(result: ZomeFunctionResult) {
    if (!result.result)
      return html`<span class="placeholder">Executing...</span>`;
    if (!result.result.payload || typeof result.result.payload === 'string')
      return html`<span>${result.result.payload}</span>`;
    else
      return html`
        <expandable-line>
          <json-viewer
            .object=${result.result.payload}
            class="fill"
          ></json-viewer>
        </expandable-line>
      `;
  }

  renderAgent() {
    if (this.agentName) return `, for ${this.agentName}`;
    if (!this.hideAgentPubKey && this.activeCell.agentPubKey)
      return `, for agent ${this.activeCell.agentPubKey}`;
  }

  render() {
    const results = this.getActiveResults();
    return html`
      <mwc-card class="block-card">
        <div class="column" style="flex: 1; margin: 16px">
          <span class="title"
            >Zome Fns Results<span class="placeholder"
              >${this.renderAgent()}</span
            >
          </span>
          ${results.length === 0
            ? html`
                <div class="row fill center-content">
                  <span class="placeholder" style="margin: 0 24px;"
                    >Call a ZomeFn to see its results</span
                  >
                </div>
              `
            : html` <div class="flex-scrollable-parent">
                <div class="flex-scrollable-container">
                  <div class="flex-scrollable-y">
                    <div style="margin: 0 16px;">
                      ${results.map(
                        ([timestamp, result], index) =>
                          html`
                            <div class="column" style="flex: 1;">
                              <div class="row" style="margin: 8px 0;">
                                ${result.result
                                  ? html`
                                      <mwc-icon
                                        style=${styleMap({
                                          color: result.result.success
                                            ? 'green'
                                            : 'red',
                                          'align-self': 'start',
                                          'margin-top': '16px',
                                          '--mdc-icon-size': '36px',
                                        })}
                                        >${result.result.success
                                          ? 'check_circle_outline'
                                          : 'error_outline'}</mwc-icon
                                      >
                                    `
                                  : html`
                                      <mwc-circular-progress
                                        indeterminate
                                        density="-2"
                                        style="align-self: center;"
                                      ></mwc-circular-progress>
                                    `}
                                <div
                                  class="column"
                                  style="flex: 1; margin: 12px; margin-right: 0;"
                                >
                                  <div class="row" style="flex: 1;">
                                    <span style="flex: 1; margin-bottom: 8px;">
                                      ${result.fnName}
                                      <span class="placeholder">
                                        in ${result.zome}
                                        zome${result.result
                                          ? result.result.success
                                            ? ', result:'
                                            : ', error:'
                                          : ''}
                                      </span>
                                    </span>
                                    <span class="placeholder">
                                      ${new Date(
                                        parseInt(timestamp)
                                      ).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  ${this.renderResult(result)}
                                </div>
                              </div>
                              ${index < results.length - 1
                                ? html`
                                    <span
                                      class="horizontal-divider"
                                      style="align-self: center;"
                                    ></span>
                                  `
                                : html``}
                            </div>
                          `
                      )}
                    </div>
                  </div>
                </div>
              </div>`}
        </div>
      </mwc-card>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex: 1;
        }
        .future {
          opacity: 0.6;
        }
      `,
      sharedStyles,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-list-item': ListItem,
      'mwc-icon': Icon,
      'mwc-circular-progress': CircularProgress,
      'mwc-button': Button,
      'mwc-card': Card,
      'json-viewer': JsonViewer,
      'expandable-line': ExpandableLine,
    };
  }
}
