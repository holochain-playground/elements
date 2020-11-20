import { LitElement } from 'lit-element';
import '@alenaksu/json-viewer';
import { Playground } from '../state/playground';
declare const EntryDetail_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class EntryDetail extends EntryDetail_base {
    withMetadata: boolean;
    static get styles(): import("lit-element").CSSResult[];
    shorten(object: any, length: number): any;
    render(): import("lit-element").TemplateResult;
}
export {};
