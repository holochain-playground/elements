import { JsonViewer } from '@power-elements/json-viewer';
import { BaseElement } from './utils/base-element';
export declare class HolochainPlaygroundEntryDetail extends BaseElement {
    withMetadata: boolean;
    static get styles(): import("lit-element").CSSResult[];
    get activeEntry(): any;
    get activeEntryDetails(): import("@holochain-open-dev/core-types").EntryDetails;
    shorten(object: any, length: number): any;
    render(): import("lit-element").TemplateResult;
    static get scopedElements(): {
        'json-viewer': typeof JsonViewer;
    };
}
