import { Playground } from '../state/playground';
import { LitElement } from 'lit-element';
import '@material/mwc-linear-progress';
declare const DHTStats_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class DHTStats extends DHTStats_base {
    private statsHelp;
    private nNodes;
    private rFactor;
    private timeout;
    private processing;
    static get styles(): import("lit-element").CSSResult;
    renderStatsHelp(): import("lit-element").TemplateResult;
    republish(): Promise<void>;
    updateDHTStats(): void;
    render(): import("lit-element").TemplateResult;
}
export {};
