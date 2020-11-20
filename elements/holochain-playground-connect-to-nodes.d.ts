import { Playground } from '../state/playground';
import { LitElement } from 'lit-element';
import { TextFieldBase } from '@material/mwc-textfield/mwc-textfield-base';
declare const ConnectToNodes_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class ConnectToNodes extends ConnectToNodes_base {
    private conductorUrls;
    private open;
    private urlsState;
    static get styles(): import("lit-element").CSSResult;
    firstUpdated(): void;
    getUrlFields(): TextFieldBase[];
    setConnectionValidity(element: any): void;
    updateFields(): void;
    renderDialog(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
}
export {};
