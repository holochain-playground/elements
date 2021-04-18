import { LitElement } from 'lit-element';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { Snackbar } from 'scoped-material-components/mwc-snackbar';
declare const CopyableHash_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost> & typeof import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost;
export declare class CopyableHash extends CopyableHash_base {
    hash: string;
    _copyNotification: Snackbar;
    copyHash(): Promise<void>;
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
    static get scopedElements(): {
        'mwc-icon-button': typeof IconButton;
        'mwc-snackbar': typeof Snackbar;
    };
}
export {};
