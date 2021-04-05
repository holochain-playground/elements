import { PlaygroundElement } from '../../context/playground-element';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { Card } from 'scoped-material-components/mwc-card';
import { Button } from 'scoped-material-components/mwc-button';
import { ZomeFunctionResult } from './types';
import { Cell } from '@holochain-playground/core';
import { Dictionary } from '@holochain-open-dev/core-types';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { ExpandableLine } from '../helpers/expandable-line';
import { JsonViewer } from '@power-elements/json-viewer';
import { Icon } from 'scoped-material-components/mwc-icon';
export declare class ZomeFnsResults extends PlaygroundElement {
    hideAgentPubKey: boolean;
    _results: Dictionary<Dictionary<Dictionary<ZomeFunctionResult>>>;
    agentName: String | undefined;
    get activeCell(): Cell;
    observedCells(): Cell[];
    onNewObservedCell(cell: Cell): import("@holochain-playground/core").MiddlewareSubscription[];
    getActiveResults(): Array<[string, ZomeFunctionResult]>;
    renderResult(result: ZomeFunctionResult): import("lit-element").TemplateResult;
    renderAgent(): string;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult[];
    static get scopedElements(): {
        'mwc-list-item': typeof ListItem;
        'mwc-icon': typeof Icon;
        'mwc-circular-progress': typeof CircularProgress;
        'mwc-button': typeof Button;
        'mwc-card': typeof Card;
        'json-viewer': typeof JsonViewer;
        'expandable-line': typeof ExpandableLine;
    };
}
