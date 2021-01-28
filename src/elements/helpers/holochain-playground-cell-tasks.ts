import { Dictionary } from '@holochain-open-dev/core-types';
import { Cell, CellSignal, sleep } from '@holochain-playground/core';
import { css, property, PropertyValues } from 'lit-element';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { Card } from 'scoped-material-components/mwc-card';
import { LinearProgress } from 'scoped-material-components/mwc-linear-progress';
import { List } from 'scoped-material-components/mwc-list';
import { ListItem } from 'scoped-material-components/mwc-list-item';
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
  _tasks: Dictionary<number> = {};

  @property({ type: Boolean })
  _expanded: Boolean = false;

  observedCells() {
    return [this.cell];
  }

  onNewObservedCell(cell: Cell) {
    return [
      cell.workflowExecutor.before(async (task) => {
        const delay = 1000;
        if (!this._tasks[task.name]) this._tasks[task.name] = 0;

        this._tasks[task.name] += 1;
        this.requestUpdate();

        await sleep(delay);
        this._tasks[task.name] -= 1;
        if (this._tasks[task.name] === 0) delete this._tasks[task.name];

        this.requestUpdate();
      }),
    ];
  }

  render() {
    if (Object.keys(this._tasks).length === 0) return html``;
    return html`
      <mwc-card
        class="tasks-card"
        style=${styleMap({
          top: `${this.y}px`,
          left: `${this.x}px`,
        })}
      >
        <mwc-list style="max-height: 300px; overflow-y: auto; width: 200px;">
          ${Object.entries(this._tasks).map(
            ([taskName, taskNumber]) => html`
              <mwc-list-item twoline>
                <span>
                  ${taskNumber > 1 ? taskNumber + 'x' : ''} ${taskName}
                </span>
                <span slot="secondary">Cell Workflow</span>
              </mwc-list-item>
            `
          )}
        </mwc-list>
        <mwc-linear-progress indeterminate></mwc-linear-progress>
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
      'mwc-list': List,
      'mwc-list-item': ListItem,
      'mwc-linear-progress': LinearProgress,
    };
  }
}
