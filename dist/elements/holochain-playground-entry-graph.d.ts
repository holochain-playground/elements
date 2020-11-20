import { Playground } from '../state/playground';
import { LitElement } from 'lit-element';
import '@material/mwc-checkbox';
declare const EntryGraph_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class EntryGraph extends EntryGraph_base {
    showAgentsIds: boolean;
    private entryGraphHelp;
    private entryGraph;
    private lastEntriesIds;
    private cy;
    private layout;
    private ready;
    firstUpdated(): void;
    updated(changedValues: any): void;
    renderEntryGraphHelp(): import("lit-element").TemplateResult;
    updatedGraph(): any;
    static get styles(): import("lit-element").CSSResult[];
    render(): import("lit-element").TemplateResult;
}
export {};
