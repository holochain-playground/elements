import { LitElement, PropertyValues } from 'lit-element';
import '@material/mwc-menu/mwc-menu-surface';
import '@alenaksu/json-viewer';
import { Playground } from '../state/playground';
declare const SourceChain_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class SourceChain extends SourceChain_base {
    static get styles(): import("lit-element").CSSResult[];
    private cy;
    private nodes;
    private _cell;
    private _subscription;
    private _nodeInfo;
    private _nodeInfoMenu;
    firstUpdated(): void;
    updated(changedValues: PropertyValues): void;
    render(): import("lit-element").TemplateResult;
}
export {};
