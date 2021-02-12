import { Checkbox } from 'scoped-material-components/mwc-checkbox';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { Formfield } from 'scoped-material-components/mwc-formfield';
import { Card } from 'scoped-material-components/mwc-card';
import { PlaygroundElement } from './utils/playground-element';
import { HelpButton } from './helpers/help-button';
export declare class EntryGraph extends PlaygroundElement {
    showFilter: boolean;
    showEntryContents: boolean;
    private entryGraph;
    private lastEntriesIds;
    private cy;
    private layout;
    private ready;
    private _entryTypes;
    excludedEntryTypes: string[];
    firstUpdated(): void;
    updated(changedValues: any): void;
    observedCells(): import("@holochain-playground/core").Cell[];
    updatedGraph(): any;
    static get styles(): import("lit-element").CSSResult[];
    renderHelp(): import("lit-element").TemplateResult;
    renderFilter(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get scopedElements(): {
        'mwc-checkbox': typeof Checkbox;
        'mwc-formfield': typeof Formfield;
        'mwc-icon-button': typeof IconButton;
        'mwc-card': typeof Card;
        'holochain-playground-help-button': typeof HelpButton;
    };
}
