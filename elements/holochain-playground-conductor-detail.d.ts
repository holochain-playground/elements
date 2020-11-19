import { LitElement } from 'lit-element';
import '@authentic/mwc-card';
import '@material/mwc-select';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@alenaksu/json-viewer';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import { Playground } from '../state/playground';
import './holochain-playground-source-chain';
import './holochain-playground-create-entries';
import './holochain-playground-dht-shard';
import './holochain-playground-entry-detail';
declare const ConductorDetail_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class ConductorDetail extends ConductorDetail_base {
    selectedTabIndex: number;
    private conductorHelp;
    firstUpdated(): void;
    static get styles(): import("lit-element").CSSResult[];
    renderAgentHelp(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
}
export {};
