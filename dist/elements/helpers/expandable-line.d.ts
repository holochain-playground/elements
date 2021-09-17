import { LitElement } from 'lit';
import { IconButton } from '@scoped-elements/material-web';
declare const ExpandableLine_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class ExpandableLine extends ExpandableLine_base {
    _expanded: boolean;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResultGroup;
    static get scopedElements(): {
        'mwc-icon-button': typeof IconButton;
    };
}
export {};
