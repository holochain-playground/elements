import { html, css, LitElement, property, query } from 'lit-element';

import { CellId } from '@holochain-open-dev/core-types';
import {
  SimulatedZome,
  SimulatedZomeFunction,
  Conductor,
} from '@holochain-playground/core';
import { sharedStyles } from './utils/shared-styles';
import { TextField } from 'scoped-material-components/mwc-textfield';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { BaseElement } from './utils/base-element';

export interface ZomeFunctionResult {
  zome: SimulatedZome;
  fnName: string;
  result: any;
}

export class HolochainPlaygroundCallZome extends BaseElement {
  @property({ type: Object })
  zome!: SimulatedZome;

  @property({ type: Object })
  conductor!: Conductor;

  @property({ type: Array })
  cellId!: CellId;

  @property({ type: Array })
  _results: ZomeFunctionResult[] = [];

  static styles = [
    css`
      :host {
        display: flex;
        flex: 1;
      }
    `,
    sharedStyles,
  ];

  _arguments = {};

  async callZomeFunction(fnName: string) {
    const result = await this.conductor.callZomeFn({
      cellId: this.cellId,
      zome: this.zome.name,
      payload: this._arguments,
      fnName,
      cap: null,
    });

    this._results.push({ result, fnName, zome: this.zome });
  }

  renderCallableFunction(name: string, zomeFunction: SimulatedZomeFunction) {
    return html`<div class="row center-content">
      <span>${name}</span>
      <div class="column" style="flex:1;">
        >${zomeFunction.arguments.map(
          (arg) =>
            html`<mwc-textfield
              label=${arg.name}
              @input=${(e) => (this._arguments[arg.name] = e.target.value)}
            ></mwc-textfield>`
        )}
      </div>
      <mwc-icon-button
        icon="play"
        @click=${() => this.callZomeFunction(name)}
      ></mwc-icon-button>
    </div>`;
  }

  renderResults() {
    return html`
      <div class="column">
        ${this._results.map(
          (result) =>
            html`<span
              >Zome: ${result.zome}, Function: ${result.fnName}:
              ${result.result}</span
            >`
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="row" style="flex: 1;">
        ${Object.entries(this.zome.zome_functions).map(([name, fn]) =>
          this.renderCallableFunction(name, fn)
        )}
        ${this.renderResults()}
      </div>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-icon-button': IconButton,
      'mwc-textfield': TextField,
    };
  }
}
