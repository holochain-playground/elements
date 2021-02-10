import { _ as __decorate, a as __metadata } from '../../tslib.es6-654e2c24.js';
import { WorkflowType, sleep, workflowPriority, Cell } from '@holochain-playground/core';
import { css, property } from 'lit-element';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { Card } from 'scoped-material-components/mwc-card';
import { Icon } from 'scoped-material-components/mwc-icon';
import { LinearProgress } from 'scoped-material-components/mwc-linear-progress';
import { List } from 'scoped-material-components/mwc-list';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { BaseElement } from '../utils/base-element.js';
import { sharedStyles } from '../utils/shared-styles.js';
import '@open-wc/scoped-elements';
import '@holochain-playground/container';

class HolochainPlaygroundCellTasks extends BaseElement {
    constructor() {
        /** Public properties */
        super(...arguments);
        this.workflowsToDisplay = [
            WorkflowType.GENESIS,
            WorkflowType.CALL_ZOME,
            WorkflowType.INCOMING_DHT_OPS,
            WorkflowType.INTEGRATE_DHT_OPS,
            WorkflowType.PRODUCE_DHT_OPS,
            WorkflowType.PUBLISH_DHT_OPS,
            WorkflowType.APP_VALIDATION,
            WorkflowType.SYS_VALIDATION,
        ];
        this.workflowDelay = 1000;
        this.showErrors = true;
        /** Private properties */
        this._runningTasks = {};
        this._errors = [];
    }
    observedCells() {
        return [this.cell];
    }
    onNewObservedCell(cell) {
        return [
            cell.workflowExecutor.before(async (task) => {
                if (!this.workflowsToDisplay.find((w) => w === task.type))
                    return;
                if (!this._runningTasks[task.type])
                    this._runningTasks[task.type] = 0;
                this._runningTasks[task.type] += 1;
                this.requestUpdate();
                await sleep(this.workflowDelay);
            }),
            cell.workflowExecutor.success(async (task) => {
                if (this._runningTasks[task.type]) {
                    this._runningTasks[task.type] -= 1;
                    if (this._runningTasks[task.type] === 0)
                        delete this._runningTasks[task.type];
                    this.requestUpdate();
                }
            }),
            cell.workflowExecutor.error(async (task, error) => {
                if (this._runningTasks[task.type]) {
                    this._runningTasks[task.type] -= 1;
                    if (this._runningTasks[task.type] === 0)
                        delete this._runningTasks[task.type];
                }
                if (this.showErrors) {
                    const errorInfo = {
                        task,
                        error,
                    };
                    this._errors.push(errorInfo);
                    this.requestUpdate();
                    await sleep(this.workflowDelay * 2);
                    const index = this._errors.findIndex((e) => e === errorInfo);
                    this._errors.splice(index, 1);
                    this.requestUpdate();
                }
            }),
        ];
    }
    sortTasks(tasks) {
        return tasks.sort((t1, t2) => workflowPriority(t1[0]) -
            workflowPriority(t2[0]));
    }
    render() {
        if (Object.keys(this._runningTasks).length === 0 &&
            this._errors.length === 0)
            return html ``;
        const orderedTasks = this.sortTasks(Object.entries(this._runningTasks));
        return html `
      <mwc-card class="tasks-card">
        <mwc-list style="max-height: 300px; overflow-y: auto; width: 200px;">
          ${this._errors.map((errorInfo) => html `
              <mwc-list-item
                twoline
                graphic="icon"
                style="--mdc-list-item-graphic-margin: 4px;"
              >
                <mwc-icon slot="graphic" style="color: red"
                  >error_outline</mwc-icon
                >
                <span> ${errorInfo.error.message} </span>
                <span slot="secondary"> ${errorInfo.task.type}</span>
              </mwc-list-item>
            `)}
          ${orderedTasks.map(([taskName, taskNumber]) => html `
              <mwc-list-item
                twoline
                graphic="icon"
                style="--mdc-list-item-graphic-margin: 4px;"
              >
                <mwc-icon
                  slot="graphic"
                  style=${styleMap({
            color: taskName === WorkflowType.CALL_ZOME ? 'green' : 'auto',
        })}
                  >${taskName === WorkflowType.CALL_ZOME
            ? 'call_made'
            : 'miscellaneous_services'}</mwc-icon
                >
                <span>
                  ${taskNumber > 1 ? taskNumber + 'x' : ''} ${taskName}
                </span>
                <span slot="secondary">Cell Workflow</span>
              </mwc-list-item>
            `)}
        </mwc-list>
        <mwc-linear-progress indeterminate></mwc-linear-progress>
      </mwc-card>
    `;
    }
    static get styles() {
        return [
            sharedStyles,
            css `
        .tasks-card {
          width: auto;
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
__decorate([
    property({ type: Object }),
    __metadata("design:type", Cell)
], HolochainPlaygroundCellTasks.prototype, "cell", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], HolochainPlaygroundCellTasks.prototype, "workflowsToDisplay", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Number)
], HolochainPlaygroundCellTasks.prototype, "workflowDelay", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], HolochainPlaygroundCellTasks.prototype, "showErrors", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], HolochainPlaygroundCellTasks.prototype, "_runningTasks", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Array)
], HolochainPlaygroundCellTasks.prototype, "_errors", void 0);

export { HolochainPlaygroundCellTasks };
//# sourceMappingURL=holochain-playground-cell-tasks.js.map
