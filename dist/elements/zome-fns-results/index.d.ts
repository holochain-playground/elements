import { ListItem } from 'scoped-material-components/mwc-list-item';
import { Card } from 'scoped-material-components/mwc-card';
import { Button } from 'scoped-material-components/mwc-button';
import { ZomeFunctionResult } from './types';
import { Cell, Workflow } from '@holochain-playground/core';
import { AgentPubKey } from '@holochain-open-dev/core-types';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { ExpandableLine } from '../helpers/expandable-line';
import { JsonViewer } from '@power-elements/json-viewer';
import { Icon } from 'scoped-material-components/mwc-icon';
import { CopyableHash } from '../helpers/copyable-hash';
import { CellObserver } from '../../base/cell-observer';
import { PlaygroundElement } from '../../base/playground-element';
import { CellsController } from '../../base/cells-controller';
export declare class ZomeFnsResults extends PlaygroundElement implements CellObserver {
    hideAgentPubKey: boolean;
    forAgent: AgentPubKey | undefined;
    private _results;
    _cellsController: CellsController;
    get activeCell(): Cell;
    observedCells(): Cell[];
    beforeWorkflow(cell: Cell, workflowInfo: Workflow<any, any>): Promise<void>;
    workflowSuccess(cell: Cell, workflowInfo: Workflow<any, any>, result: any): Promise<void>;
    workflowError(cell: Cell, workflowInfo: Workflow<any, any>, error: any): Promise<void>;
    getActiveResults(): Array<[string, ZomeFunctionResult]>;
    renderResult(result: ZomeFunctionResult): import("lit-html").TemplateResult<1>;
    renderAgent(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup[];
    static elementDefinitions: {
        'mwc-list-item': typeof ListItem;
        'mwc-icon': typeof Icon;
        'mwc-circular-progress': typeof CircularProgress;
        'mwc-button': typeof Button;
        'mwc-card': typeof Card;
        'json-viewer': typeof JsonViewer;
        'expandable-line': typeof ExpandableLine;
        'copyable-hash': typeof CopyableHash;
    };
}
