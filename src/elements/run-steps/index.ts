import { html, css } from 'lit';
import { state, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { PlaygroundElement } from '../../base/playground-element';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { Card } from 'scoped-material-components/mwc-card';
import { sharedStyles } from '../utils/shared-styles';
import { List } from 'scoped-material-components/mwc-list';
import { Button } from 'scoped-material-components/mwc-button';

export interface Step {
  title: (context: PlaygroundElement) => string;
  run: (context: PlaygroundElement) => Promise<void>;
}

export class RunSteps extends PlaygroundElement {
  @property({ type: Array })
  steps!: Array<Step>;

  @state()
  _runningStepIndex: number | undefined = undefined;

  @state()
  _running = false;

  async runSteps() {
    this._running = true;

    for (let i = 0; i < this.steps.length; i++) {
      this._runningStepIndex = i;
      await this.steps[i].run(this);
    }
    this._running = false;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        <div class="column" style="margin: 16px; flex: 1;">
          <div class="row">
            <span class="block-title" style="flex: 1;">Run Steps</span>
            <mwc-button
              .label=${this._running ? 'RUNNING...' : 'RUN'}
              raised
              .disabled=${this._running}
              @click=${() => this.runSteps()}
            ></mwc-button>
          </div>
          ${this.steps
            ? html`
                <mwc-list activatable>
                  ${this.steps.map(
                    (step, index) =>
                      html`<mwc-list-item
                        noninteractive
                        class=${classMap({
                          future: this._runningStepIndex < index,
                        })}
                        .activated=${this._running &&
                        this._runningStepIndex === index}
                        >${index + 1}. ${step.title(this)}</mwc-list-item
                      >`
                  )}
                </mwc-list>
              `
            : html`<div class="center-content" style="flex: 1;">
                <span class="placeholder">There are no steps to run</span>
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
          opacity: 0.7;
        }
      `,
      sharedStyles,
    ];
  }

  static elementDefinitions = {
    'mwc-list-item': ListItem,
    'mwc-list': List,
    'mwc-button': Button,
    'mwc-card': Card,
  };
}
