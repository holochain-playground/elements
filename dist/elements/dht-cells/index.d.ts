import { MenuSurface } from 'scoped-material-components/mwc-menu-surface';
import { Button } from 'scoped-material-components/mwc-button';
import { Hash } from '@holochain-open-dev/core-types';
import { Cell, NetworkRequestType, WorkflowType } from '@holochain-playground/core';
import { Card } from 'scoped-material-components/mwc-card';
import { CellTasks } from '../helpers/cell-tasks';
import { HelpButton } from '../helpers/help-button';
import { PlaygroundElement } from '../utils/playground-element';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
export declare class DhtCells extends PlaygroundElement {
    animationDelay: number;
    workflowsToDisplay: WorkflowType[];
    networkRequestsToDisplay: NetworkRequestType[];
    private graph;
    private _cy;
    private _layout;
    firstUpdated(): Promise<void>;
    highlightNodesWithEntry(entryHash: Hash): void;
    observedCells(): Cell[];
    onNewObservedCell(cell: Cell): import("@holochain-playground/core").MiddlewareSubscription[];
    onCellsChanged(): void;
    _neighborEdges: any[];
    updated(changedValues: any): void;
    renderHelp(): import("lit-element").TemplateResult;
    renderTasksTooltips(): import("lit-element").TemplateResult;
    renderCopyButton(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
    static get scopedElements(): {
        'mwc-card': typeof Card;
        'mwc-menu-surface': typeof MenuSurface;
        'mwc-button': typeof Button;
        'mwc-icon-button': typeof IconButton;
        'holochain-playground-help-button': typeof HelpButton;
        'holochain-playground-cell-tasks': typeof CellTasks;
    };
}
