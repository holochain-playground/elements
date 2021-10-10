import { MenuSurface } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { NetworkRequestType, WorkflowType, NetworkRequestInfo } from '@holochain-playground/core';
import { Card, Slider, Switch, IconButton, Formfield, Icon, Menu, ListItem } from '@scoped-elements/material-web';
import { CellTasks } from '../helpers/cell-tasks';
import { HelpButton } from '../helpers/help-button';
import { PlaygroundElement } from '../../base/playground-element';
import { CellObserver } from '../../base/cell-observer';
import { CopyableHash } from '../helpers/copyable-hash';
/**
 * @element dht-cells
 */
export declare class DhtCells extends PlaygroundElement implements CellObserver {
    animationDelay: number;
    workflowsToDisplay: WorkflowType[];
    networkRequestsToDisplay: NetworkRequestType[];
    hideTimeController: boolean;
    hideFilter: boolean;
    stepByStep: boolean;
    showZomeFnSuccess: boolean;
    private _graph;
    private _activeWorkflowsButton;
    private _activeWorkflowsMenu;
    private _networkRequestsButton;
    private _networkRequestsMenu;
    private _cy;
    private _layout;
    private _resumeObservable;
    private _onPause;
    private cellsController;
    observedCells(): import("@holochain-playground/core").Cell[];
    firstUpdated(): Promise<void>;
    highlightNodesWithEntry(): void;
    beforeNetworkRequest(networkRequest: NetworkRequestInfo<any, any>): Promise<void>;
    onCellsChanged(): void;
    setupGraphNodes(): void;
    _neighborEdges: any[];
    updated(changedValues: any): void;
    renderTimeController(): import("lit-html").TemplateResult<1>;
    renderHelp(): import("lit-html").TemplateResult<1>;
    renderTasksTooltips(): import("lit-html").TemplateResult<1>;
    renderBottomToolbar(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResult[];
    static get scopedElements(): {
        'mwc-card': typeof Card;
        'mwc-menu-surface': typeof MenuSurface;
        'mwc-button': typeof Button;
        'mwc-icon': typeof Icon;
        'mwc-menu': typeof Menu;
        'mwc-list-item': typeof ListItem;
        'mwc-slider': typeof Slider;
        'mwc-switch': typeof Switch;
        'mwc-formfield': typeof Formfield;
        'mwc-icon-button': typeof IconButton;
        'copyable-hash': typeof CopyableHash;
        'holochain-playground-help-button': typeof HelpButton;
        'holochain-playground-cell-tasks': typeof CellTasks;
    };
}
