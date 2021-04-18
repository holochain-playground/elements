import { JsonViewer } from '@power-elements/json-viewer';
import { PlaygroundElement } from '../../context/playground-element';
import { Card } from 'scoped-material-components/mwc-card';
import { CopyableHash } from '../helpers/copyable-hash';
/**
 * @element entry-contents
 */
export declare class EntryContents extends PlaygroundElement {
    static get styles(): import("lit-element").CSSResult[];
    get activeHashedContent(): any;
    render(): import("lit-element").TemplateResult;
    static get scopedElements(): {
        'json-viewer': typeof JsonViewer;
        'mwc-card': typeof Card;
        'copyable-hash': typeof CopyableHash;
    };
}
