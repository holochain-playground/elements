import { html, css, property } from 'lit-element';

import { CellId, Dictionary } from '@holochain-open-dev/core-types';
import {
  SimulatedZome,
  SimulatedZomeFunction,
  Cell,
} from '@holochain-playground/core';
import { sharedStyles } from './utils/shared-styles';
import { TextField } from 'scoped-material-components/mwc-textfield';
import { PlaygroundElement } from '../context/playground-element';
import { Button } from 'scoped-material-components/mwc-button';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { Icon } from 'scoped-material-components/mwc-icon';
import { styleMap } from 'lit-html/directives/style-map';
import { selectCell } from './utils/selectors';
import { Tab } from 'scoped-material-components/mwc-tab';
import { TabBar } from 'scoped-material-components/mwc-tab-bar';
import { Card } from 'scoped-material-components/mwc-card';
import { shortenStrRec } from './utils/hash';
import { JsonViewer } from '@power-elements/json-viewer';

export interface ZomeFunctionResult {
  cellId: CellId;
  zome: SimulatedZome;
  fnName: string;
  result:
    | undefined
    | {
        success: boolean;
        payload: any;
      };
}

export class CallZomeFns extends PlaygroundElement {
  @property({ type: Boolean, attribute: 'hide-results' })
  hideResults = false;

  @property({ type: Boolean, attribute: 'hide-zome-selector' })
  hideZomeSelector = false;

  @property({ type: Number })
  _selectedZomeIndex: number = 0;

  @property({ type: Array })
  // Results segmented by dnaHash/agentPubKey/timestamp
  _results: Dictionary<Dictionary<Dictionary<ZomeFunctionResult>>> = {};

  // Arguments segmented by dnaHash/agentPubKey/zome/fn_name/arg_name
  _arguments: Dictionary<
    Dictionary<Dictionary<Dictionary<Dictionary<any>>>>
  > = {};

  get activeCell(): Cell {
    return selectCell(this.activeDna, this.activeAgentPubKey, this.conductors);
  }

  get activeZome(): SimulatedZome {
    return this.activeCell.getSimulatedDna().zomes[this._selectedZomeIndex];
  }

  observedCells() {
    return [this.activeCell];
  }

  setResultValue(timestamp: number, value: ZomeFunctionResult) {
    const dnaHash = this.activeCell.dnaHash;
    const agentPubKey = this.activeCell.agentPubKey;

    if (!this._results[dnaHash]) this._results[dnaHash] = {};
    if (!this._results[dnaHash][agentPubKey])
      this._results[dnaHash][agentPubKey] = {};

    this._results[dnaHash][agentPubKey][timestamp] = value;
  }
  getResultValue(timestamp: number): ZomeFunctionResult | undefined {
    return this.getActiveResults()[timestamp];
  }
  getActiveResults(): Dictionary<ZomeFunctionResult> {
    const dnaHash = this.activeCell.dnaHash;
    const agentPubKey = this.activeCell.agentPubKey;
    return (
      (this._results[dnaHash] && this._results[dnaHash][agentPubKey]) || {}
    );
  }

  setFunctionArgument(fnName: string, argName: string, argValue: any) {
    const dnaHash = this.activeCell.dnaHash;
    const pubKey = this.activeCell.agentPubKey;
    const zomeName = this.activeZome.name;

    if (!this._arguments[dnaHash]) this._arguments[dnaHash] = {};
    if (!this._arguments[dnaHash][pubKey])
      this._arguments[dnaHash][pubKey] = {};
    if (!this._arguments[dnaHash][pubKey][zomeName])
      this._arguments[dnaHash][pubKey][zomeName] = {};
    if (!this._arguments[dnaHash][pubKey][zomeName][fnName])
      this._arguments[dnaHash][pubKey][zomeName][fnName] = {};
    this._arguments[dnaHash][pubKey][zomeName][fnName][argName] = argValue;
  }

  getFunctionArguments(fnName: string): Dictionary<any> {
    const dnaHash = this.activeCell.dnaHash;
    const agentPubKey = this.activeCell.agentPubKey;
    const zomeName = this.activeZome.name;
    return (
      this._arguments[dnaHash] &&
      this._arguments[dnaHash][agentPubKey] &&
      this._arguments[dnaHash][agentPubKey][zomeName] &&
      this._arguments[dnaHash][agentPubKey][zomeName][fnName]
    );
  }
  getFunctionArgument(fnName: string, argName: string): any {
    const dnaHash = this.activeCell.dnaHash;
    const agentPubKey = this.activeCell.agentPubKey;
    const zomeName = this.activeZome.name;
    return (
      this._arguments[dnaHash] &&
      this._arguments[dnaHash][agentPubKey] &&
      this._arguments[dnaHash][agentPubKey][zomeName] &&
      this._arguments[dnaHash][agentPubKey][zomeName][fnName] &&
      this._arguments[dnaHash][agentPubKey][zomeName][fnName][argName]
    );
  }

  async callZomeFunction(fnName: string) {
    const zome = this.activeZome;
    const timestamp = Date.now();

    const resultValue = {
      cellId: this.activeCell.cellId,
      result: undefined,
      fnName,
      zome,
    };

    this.setResultValue(timestamp, resultValue);

    this.requestUpdate();

    try {
      const result = await this.activeCell.conductor.callZomeFn({
        cellId: this.activeCell.cellId,
        zome: zome.name,
        payload: this.getFunctionArguments(fnName),
        fnName,
        cap: null,
      });
      resultValue.result = { success: true, payload: result };
      this.setResultValue(timestamp, resultValue);
    } catch (e) {
      resultValue.result = { success: false, payload: e.message };
      this.setResultValue(timestamp, resultValue);
    } finally {
      this.requestUpdate();
    }
  }

  renderCallableFunction(fnName: string, zomeFunction: SimulatedZomeFunction) {
    return html`<div class="row" style="margin: 8px 0;">
      <mwc-button
        raised
        @click=${() => this.callZomeFunction(fnName)}
        style="width: 12em; margin: 18px; margin-left: 0;"
        >${fnName}</mwc-button
      >
      <div class="column" style="flex: 1; margin-left: 16px;">
        ${zomeFunction.arguments.length === 0
          ? html`<span class="placeholder" style="margin-top: 28px;"
              >This function has no arguments</span
            >`
          : zomeFunction.arguments.map(
              (arg) => html`<mwc-textfield
                style="margin-top: 8px"
                outlined
                label=${arg.name + ': ' + arg.type}
                .value=${this.getFunctionArgument(fnName, arg.name) || ''}
                @input=${(e) =>
                  this.setFunctionArgument(fnName, arg.name, e.target.value)}
              ></mwc-textfield>`
            )}
      </div>
    </div>`;
  }

  renderActiveZomeFns() {
    const zome = this.activeCell.getSimulatedDna().zomes[
      this._selectedZomeIndex
    ];
    const zomeFns = Object.entries(zome.zome_functions);

    if (zomeFns.length === 0)
      return html`<div class="fill center-content">
        <span class="placeholder" style="padding: 24px;"
          >This zome has no functions</span
        >
      </div> `;

    return html`
      <div class="flex-scrollable-parent">
        <div class="flex-scrollable-container">
          <div class="flex-scrollable-y">
            <div class="column" style="flex: 1; margin: 0 16px;">
              ${zomeFns.map(
                ([name, fn], index) =>
                  html`${this.renderCallableFunction(name, fn)}${index <
                  zomeFns.length - 1
                    ? html`<span class="horizontal-divider"></span>`
                    : html``}`
              )}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderResults() {
    const results = this.getActiveResults();

    const sortedTimestamps = Object.keys(results).sort();
    const sortedResults = sortedTimestamps.map(
      (timestamp) =>
        [timestamp, results[timestamp]] as [string, ZomeFunctionResult]
    );

    return html`
      <div class="column" style="flex: 1;">
        ${sortedResults.length === 0
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
                  <div style="margin: 0 16px; margin-top: 16px;">
                    <span class="title">
                      Results for
                      ${shortenStrRec(this.activeCell.cellId[1])}</span
                    >
                    ${sortedResults.map(
                      ([timestamp, result], index) =>
                        html`
                          <div class="column" style="flex: 1;">
                            <div class="row" style="margin: 8px 16px;">
                              ${result.result
                                ? html`
                                    <mwc-icon
                                      style=${styleMap({
                                        color: result.result.success
                                          ? 'green'
                                          : 'red',
                                        'align-self': 'center',
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
                                      in ${result.zome.name} zome
                                    </span>
                                  </span>
                                  <span class="placeholder">
                                    ${new Date(
                                      parseInt(timestamp)
                                    ).toLocaleTimeString()}
                                  </span>
                                </div>
                                <div class="row">
                                  ${result.result
                                    ? html`
                                        <span>
                                          ${result.result.success
                                            ? 'Result'
                                            : 'Error'}:
                                          ${typeof result.result.payload ===
                                          'string'
                                            ? result.result.payload
                                            : html`
                                                <json-viewer
                                                  .object=${shortenStrRec(
                                                    result.result.payload
                                                  )}
                                                  class="fill"
                                                ></json-viewer>
                                              `}</span
                                        >
                                      `
                                    : html`<span class="placeholder"
                                        >Executing...</span
                                      >`}
                                </div>
                              </div>
                            </div>
                            ${index < sortedResults.length - 1
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
    `;
  }

  render() {
    return html`
      <mwc-card style="width: auto; flex: 1;">
        ${this.activeCell
          ? html`
              <div class="row" style="flex: 1;">
                <div class="column" style="flex: 1">
                  <span class="title" style="margin: 16px;">Call Zome Fns</span>
                  ${this.hideZomeSelector
                    ? html``
                    : html`
                        <mwc-tab-bar
                          .activeIndex=${this._selectedZomeIndex}
                          @MDCTabBar:activated=${(e: CustomEvent) =>
                            (this._selectedZomeIndex = e.detail.index)}
                        >
                          ${this.activeCell
                            .getSimulatedDna()
                            .zomes.map(
                              (zome) =>
                                html` <mwc-tab .label=${zome.name}></mwc-tab> `
                            )}
                        </mwc-tab-bar>
                      `}
                  ${this.renderActiveZomeFns()}
                </div>
                ${this.hideResults
                  ? html``
                  : html`
                      <span class="vertical-divider"></span>
                      ${this.renderResults()}
                    `}
              </div>
            `
          : html`<div class="fill center-content placeholder">
              <span style="padding: 24px;"
                >Select a cell to call its zome functions</span
              >
            </div>`}
      </mwc-card>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
          flex: 1;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-button': Button,
      'mwc-textfield': TextField,
      'mwc-circular-progress': CircularProgress,
      'mwc-icon': Icon,
      'mwc-tab': Tab,
      'mwc-tab-bar': TabBar,
      'mwc-card': Card,
      'json-viewer': JsonViewer,
    };
  }
}
