import { CellId, Dictionary } from '@holochain-open-dev/core-types';
import { SimulatedZome, SimulatedZomeFunction, Cell } from '@holochain-playground/core';
import { TextField } from 'scoped-material-components/mwc-textfield';
import { BaseElement } from './utils/base-element';
import { Button } from 'scoped-material-components/mwc-button';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { Icon } from 'scoped-material-components/mwc-icon';
import { Tab } from 'scoped-material-components/mwc-tab';
import { TabBar } from 'scoped-material-components/mwc-tab-bar';
import { Card } from 'scoped-material-components/mwc-card';
import { JsonViewer } from '@power-elements/json-viewer';
export interface ZomeFunctionResult {
    cellId: CellId;
    zome: SimulatedZome;
    fnName: string;
    result: undefined | {
        success: boolean;
        payload: any;
    };
}
export declare class HolochainPlaygroundCallZome extends BaseElement {
    _selectedZomeIndex: number;
    _results: Dictionary<ZomeFunctionResult>;
    static styles: import("lit-element").CSSResult[];
    _arguments: Dictionary<Dictionary<Dictionary<any>>>;
    get activeCell(): Cell;
    get activeZome(): SimulatedZome;
    observedCells(): Cell[];
    callZomeFunction(zomeName: string, fnName: string): Promise<void>;
    setFunctionArgument(zome: string, fnName: string, argName: string, argValue: any): void;
    renderCallableFunction(zome: string, name: string, zomeFunction: SimulatedZomeFunction): import("lit-element").TemplateResult;
    renderActiveZomeFns(): import("lit-element").TemplateResult;
    renderResults(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get scopedElements(): {
        'mwc-button': typeof Button;
        'mwc-textfield': typeof TextField;
        'mwc-circular-progress': typeof CircularProgress;
        'mwc-icon': typeof Icon;
        'mwc-tab': typeof Tab;
        'mwc-tab-bar': typeof TabBar;
        'mwc-card': typeof Card;
        'json-viewer': typeof JsonViewer;
    };
}
