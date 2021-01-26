import {
  Cell,
  CellSignal,
  Task,
  DelayExecutor,
} from '@holochain-playground/core';
import { css, property, PropertyValues } from 'lit-element';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { Card } from 'scoped-material-components/mwc-card';
import { LinearProgress } from 'scoped-material-components/mwc-linear-progress';
import { BaseElement } from '../utils/base-element';
import { sharedStyles } from '../utils/shared-styles';

export class HolochainPlaygroundCellTasks extends BaseElement {
  @property({ type: Object })
  cell!: Cell;

  @property({ type: Number })
  x: number;
  @property({ type: Number })
  y!: number;

  @property({ type: Array })
  signals: CellSignal[] = ['after-workflow-executed'];

  @property({ type: Object })
  _tasks: Array<{ progress: number; task: Task<any> }> = [];

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    if (changedValues.has('cell')) {
      const executor = this.cell.conductor.executor;
      const delay = (executor as DelayExecutor).delayMillis;
      this.subscribeToCell(this.cell, ['before-workflow-executed'], (task) => {
        this._tasks.push({
          task,
          progress: 0,
        });
        if (delay) {
          const startedAt = Date.now() + 20;
          const interval = setInterval(() => {
            const elapsed = Date.now() - startedAt;
            const progress = elapsed / delay;

            const taskIndex = this._tasks.findIndex((t) => t.task === task);
            this._tasks[taskIndex].progress = progress;

            this.requestUpdate();

            if (progress >= 1) {
              clearInterval(interval);
              this._tasks = [...this._tasks.filter((t) => t.task !== task)];
            }
          }, 200);
        }
      });
    }
  }

  render() {
    if (this._tasks.length === 0) return html``;
    return html`
      <mwc-card class="tasks-card" "
      style=${styleMap({
        top: `${this.y}px`,
        left: `${this.x}px`,
      })}
>
      <div
        class="column"
        style="padding: 16px; max-height: 300px; overflow-y: auto;"
      >
        ${this._tasks.map(
          (task) => html`
            <div style="margin-bottom: 16px;">
              <span style="margin-bottom: 4px;"> ${task.task.name} </span>
              ${task.progress
                ? html`
                    <mwc-linear-progress
                      .progress=${task.progress}
                    ></mwc-linear-progress>
                  `
                : html``}
            </div>
          `
        )}
      </div>
    </mwc-card>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        .tasks-card {
          position: fixed;
          width: auto;
          z-index: 100;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-card': Card,
      'mwc-linear-progress': LinearProgress,
    };
  }
}
