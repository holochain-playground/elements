import { LitElement } from 'lit-element';
import '@material/mwc-icon-button';
import '@material/mwc-button';
import { Playground } from '../state/playground';
declare const DHTGraph_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class DHTGraph extends DHTGraph_base {
    private dhtHelp;
    private lastNodes;
    private cy;
    private layout;
    static get styles(): import("lit-element").CSSResult[];
    firstUpdated(): Promise<void>;
    highlightNodesWithEntry(entryId: string): void;
    updated(changedValues: any): void;
    renderDHTHelp(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
}
export {};
