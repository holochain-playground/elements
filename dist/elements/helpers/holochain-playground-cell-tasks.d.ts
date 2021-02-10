import { Cell, WorkflowType } from '@holochain-playground/core';
import { Card } from 'scoped-material-components/mwc-card';
import { Icon } from 'scoped-material-components/mwc-icon';
import { LinearProgress } from 'scoped-material-components/mwc-linear-progress';
import { List } from 'scoped-material-components/mwc-list';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { BaseElement } from '../utils/base-element';
export declare class HolochainPlaygroundCellTasks extends BaseElement {
    /** Public properties */
    cell: Cell;
    workflowsToDisplay: WorkflowType[];
    workflowDelay: number;
    showErrors: boolean;
    /** Private properties */
    private _runningTasks;
    private _errors;
    observedCells(): Cell[];
    onNewObservedCell(cell: Cell): import("@holochain-playground/core").MiddlewareSubscription[];
    sortTasks(tasks: Array<[string, number]>): [string, number][];
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
    static get scopedElements(): {
        'mwc-card': typeof Card;
        'mwc-list': typeof List;
        'mwc-icon': typeof Icon;
        'mwc-list-item': typeof ListItem;
        'mwc-linear-progress': typeof LinearProgress;
    };
}
