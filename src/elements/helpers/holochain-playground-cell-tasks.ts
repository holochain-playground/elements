import { Dictionary } from '@holochain-open-dev/core-types';
import { Cell, sleep, WorkflowType } from '@holochain-playground/core';
import { css, property, PropertyValues } from 'lit-element';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { Card } from 'scoped-material-components/mwc-card';
import { Icon } from 'scoped-material-components/mwc-icon';
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
  @property({ type: Number })
  workflowDelay: number = 1000;

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
        if (!this.workflowsToDisplay.find((w) => w === task.type)) return;

        if (!this._tasks[task.type]) this._tasks[task.type] = 0;

        this._tasks[task.type] += 1;
        this.requestUpdate();

        await sleep(this.workflowDelay);
        this._tasks[task.type] -= 1;
        if (this._tasks[task.type] === 0) delete this._tasks[task.type];

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
              <mwc-list-item twoline graphic="icon" style="--mdc-list-item-graphic-margin: 4px;">
                <mwc-icon slot="graphic">miscellaneous_services</mwc-icon>
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
      'mwc-icon': Icon,
      'mwc-list-item': ListItem,
      'mwc-linear-progress': LinearProgress,
    };
  }
}
