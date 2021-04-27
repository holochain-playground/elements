import { Dictionary } from '@holochain-open-dev/core-types';
import {
  Cell,
  sleep,
  Workflow,
  WorkflowType,
  workflowPriority,
  CallZomeFnWorkflow,
} from '@holochain-playground/core';
import { css, html } from 'lit';
import { property, state } from 'lit/decorators.js';

import { Subject } from 'rxjs';
import { Card } from 'scoped-material-components/mwc-card';
import { Icon } from 'scoped-material-components/mwc-icon';
import { LinearProgress } from 'scoped-material-components/mwc-linear-progress';
import { List } from 'scoped-material-components/mwc-list';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { CellObserver } from '../../base/cell-observer';
import { CellsController } from '../../base/cells-controller';
import { PlaygroundElement } from '../../base/playground-element';
import { sharedStyles } from '../utils/shared-styles';

export class CellTasks extends PlaygroundElement implements CellObserver {
  /** Public properties */

  @property({ type: Object })
  cell!: Cell;

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

  @property({ type: Boolean, attribute: 'hide-errors' })
  hideErrors = false;

  @property({ type: Boolean, attribute: 'show-zome-fn-success' })
  showZomeFnSuccess = false;

  @property({ type: Boolean })
  stepByStep: boolean = false;

  _onPause: boolean = false;
  _resumeObservable!: Subject<any>;

  /** Private properties */

  @state()
  private _callZomeTasks: Array<CallZomeFnWorkflow> = [];
  @state()
  private _runningTasks: Dictionary<number> = {};

  @state()
  private _successes: Array<{ task: CallZomeFnWorkflow; payload: any }> = [];

  @state()
  private _errors: Array<{ task: Workflow<any, any>; error: any }> = [];

  private _cellsController = new CellsController(this);

  observedCells() {
    return [this.cell];
  }

  async beforeWorkflow(cell: Cell, task: Workflow<any, any>) {
    if (!this.workflowsToDisplay.includes(task.type as WorkflowType)) return;

    if (task.type === WorkflowType.CALL_ZOME) {
      this._callZomeTasks.push(task);
    } else {
      if (!this._runningTasks[task.type]) this._runningTasks[task.type] = 0;

      this._runningTasks[task.type] += 1;
    }
    this.requestUpdate();

    if (this.stepByStep) {
      this.dispatchEvent(
        new CustomEvent('execution-paused', {
          detail: { paused: true },
          composed: true,
          bubbles: true,
        })
      );
      await new Promise((resolve) =>
        this._resumeObservable.subscribe(() => resolve(null))
      );
      this.dispatchEvent(
        new CustomEvent('execution-paused', {
          detail: { paused: false },
          composed: true,
          bubbles: true,
        })
      );
    } else {
      await sleep(this.workflowDelay);
    }
  }

  async workflowSuccess(cell: Cell, task: Workflow<any, any>, result: any) {
    if (task.type === WorkflowType.CALL_ZOME) {
      this._callZomeTasks = this._callZomeTasks.filter((t) => t !== task);

      if (this.showZomeFnSuccess) {
        const successInfo = { task, payload: result };
        this._successes.push(successInfo);
        this.requestUpdate();

        if (this.stepByStep) {
          this.dispatchEvent(
            new CustomEvent('execution-paused', {
              detail: { paused: true },
              composed: true,
              bubbles: true,
            })
          );
          await new Promise((resolve) =>
            this._resumeObservable.subscribe(() => resolve(null))
          );
          this.dispatchEvent(
            new CustomEvent('execution-paused', {
              detail: { paused: false },
              composed: true,
              bubbles: true,
            })
          );
        } else {
          await sleep(this.workflowDelay);
        }
        const index = this._successes.findIndex((e) => e === successInfo);
        this._successes.splice(index, 1);
      }
    } else if (this._runningTasks[task.type]) {
      this._runningTasks[task.type] -= 1;
      if (this._runningTasks[task.type] === 0)
        delete this._runningTasks[task.type];
    }
    this.requestUpdate();
  }

  async workflowError(cell: Cell, task: Workflow<any, any>, error: any) {
    if (task.type === WorkflowType.CALL_ZOME) {
      this._callZomeTasks = this._callZomeTasks.filter((t) => t !== task);
    } else if (this._runningTasks[task.type]) {
      this._runningTasks[task.type] -= 1;
      if (this._runningTasks[task.type] === 0)
        delete this._runningTasks[task.type];
    }

    if (!this.hideErrors) {
      const errorInfo = {
        task,
        error,
      };
      this._errors.push(errorInfo);

      this.requestUpdate();

      if (this.stepByStep) {
        this.dispatchEvent(
          new CustomEvent('execution-paused', {
            detail: { paused: true },
            composed: true,
            bubbles: true,
          })
        );
        await new Promise((resolve) =>
          this._resumeObservable.subscribe(() => resolve(null))
        );
        this.dispatchEvent(
          new CustomEvent('execution-paused', {
            detail: { paused: false },
            composed: true,
            bubbles: true,
          })
        );
      } else {
        await sleep(this.workflowDelay);
      }

      const index = this._errors.findIndex((e) => e === errorInfo);
      this._errors.splice(index, 1);
    }
    this.requestUpdate();
  }

  sortTasks(tasks: Array<[string, number]>) {
    return tasks.sort(
      (t1, t2) =>
        workflowPriority(t1[0] as WorkflowType) -
        workflowPriority(t2[0] as WorkflowType)
    );
  }

  showTasks() {
    return (
      Object.keys(this._runningTasks).length !== 0 ||
      this._errors.length !== 0 ||
      this._successes.length !== 0 ||
      this._callZomeTasks.length !== 0
    );
  }

  render() {
    if (!this.showTasks()) return html``;
    const orderedTasks = this.sortTasks(Object.entries(this._runningTasks));
    return html`
      <mwc-card class="tasks-card">
        <mwc-list style="max-height: 300px; overflow-y: auto; width: 200px;">
          ${this._callZomeTasks.map(
            (callZome) => html`
              <mwc-list-item
                twoline
                graphic="icon"
                style="--mdc-list-item-graphic-margin: 4px;"
              >
                <mwc-icon slot="graphic" style="color: green;"
                  >call_made</mwc-icon
                >
                <span>${callZome.details.fnName}</span>
                <span slot="secondary">${callZome.details.zome} zome</span>
              </mwc-list-item>
            `
          )}
          ${this._errors.map(
            (errorInfo) => html`
              <mwc-list-item
                twoline
                graphic="icon"
                style="--mdc-list-item-graphic-margin: 4px;"
              >
                <mwc-icon slot="graphic" style="color: red"
                  >error_outline</mwc-icon
                >
                <span> ${errorInfo.error.message} </span>
                <span slot="secondary">
                  ${errorInfo.task.type === WorkflowType.CALL_ZOME
                    ? `${
                        (errorInfo.task as CallZomeFnWorkflow).details.fnName
                      } in ${
                        (errorInfo.task as CallZomeFnWorkflow).details.zome
                      }`
                    : errorInfo.task.type}</span
                >
              </mwc-list-item>
            `
          )}
          ${this._successes.map(
            ({ task, payload }) => html`
              <mwc-list-item
                twoline
                graphic="icon"
                style="--mdc-list-item-graphic-margin: 4px;"
              >
                <mwc-icon slot="graphic" style="color: green"
                  >check_circle_outline</mwc-icon
                >
                <span> ${task.details.fnName}</span>
                <span slot="secondary">Success</span>
              </mwc-list-item>
            `
          )}
          ${orderedTasks.map(
            ([taskName, taskNumber]) => html`
              <mwc-list-item
                twoline
                graphic="icon"
                style="--mdc-list-item-graphic-margin: 4px;"
              >
                <mwc-icon slot="graphic">miscellaneous_services</mwc-icon>
                <span>
                  ${taskNumber > 1 ? taskNumber + 'x' : ''} ${taskName}
                </span>
                <span slot="secondary">Cell Workflow</span>
              </mwc-list-item>
            `
          )}
        </mwc-list>
        ${this.stepByStep
          ? html``
          : html` <mwc-linear-progress indeterminate></mwc-linear-progress> `}
      </mwc-card>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        .tasks-card {
          width: auto;
        }
      `,
    ];
  }

  static elementDefinitions = {
    'mwc-card': Card,
    'mwc-list': List,
    'mwc-icon': Icon,
    'mwc-list-item': ListItem,
    'mwc-linear-progress': LinearProgress,
  };
}
