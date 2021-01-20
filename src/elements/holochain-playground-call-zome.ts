import { html, css, LitElement, property, query } from 'lit-element';

import { CellId } from '@holochain-open-dev/core-types';
import {
  SimulatedZome,
  SimulatedZomeFunction,
  Conductor,
} from '@holochain-playground/core';
import { sharedStyles } from './utils/shared-styles';
import { TextField } from 'scoped-material-components/mwc-textfield';
import { BaseElement } from './utils/base-element';
import { Button } from 'scoped-material-components/mwc-button';

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
      hr {
        height: 1px;
        width: 100%;
        opacity: 0.6;
        margin-bottom: 0;
      }
    `,
    sharedStyles,
  ];

  _arguments = {};

  async callZomeFunction(fnName: string) {
    try {
      const result = await this.conductor.callZomeFn({
        cellId: this.cellId,
        zome: this.zome.name,
        payload: this._arguments,
        fnName,
        cap: null,
      });
      this._results.push({ result, fnName, zome: this.zome });
    } catch (e) {
      this._results.push({ result: e, fnName, zome: this.zome });
    } finally {
      this.requestUpdate();
    }
  }

  renderCallableFunction(name: string, zomeFunction: SimulatedZomeFunction) {
    return html`<div class="row" style="margin: 8px 0;">
      <mwc-button
        raised
        @click=${() => this.callZomeFunction(name)}
        style="width: 12em; margin-top: 18px;"
        >${name}</mwc-button
      >
      <div class="column" style="flex: 1; margin-left: 16px;">
        ${zomeFunction.arguments.map(
          (arg) =>
            html`<mwc-textfield
              style="margin-top: 8px"
              outlined
              label=${arg.name + ': ' + arg.type}
              @input=${(e) => (this._arguments[arg.name] = e.target.value)}
            ></mwc-textfield>`
        )}
      </div>
    </div>`;
  }

  renderResults() {
    return html`
      <div class="column">
        ${this._results.map(
          (result) =>
            html`<span
              >${result.zome.name} > ${result.fnName}: ${result.result}</span
            >`
        )}
      </div>
    `;
  }

  render() {
    const zomeFns = Object.entries(this.zome.zome_functions);
    return html`
      <div class="column" style="flex: 1;">
        ${zomeFns.map(
          ([name, fn], index) =>
            html`${this.renderCallableFunction(name, fn)}${index <
            zomeFns.length - 1
              ? html`<hr />`
              : html``}`
        )}
      </div>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-button': Button,
      'mwc-textfield': TextField,
    };
  }
}
