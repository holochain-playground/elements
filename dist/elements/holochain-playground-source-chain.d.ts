import { PropertyValues } from 'lit-element';
import { Cell } from '@holochain-playground/core';
import { BaseElement } from './utils/base-element';
import { Card } from 'scoped-material-components/mwc-card';
import { HolochainPlaygroundHelpButton } from './helpers/holochain-playground-help-button';
export declare class HolochainPlaygroundSourceChain extends BaseElement {
    static get styles(): import("lit-element").CSSResult[];
    private cy;
    private nodes;
    private _cell;
    private graph;
    firstUpdated(): void;
    observedCells(): Cell[];
    updated(changedValues: PropertyValues): void;
    renderHelp(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    static get scopedElements(): {
        'mwc-card': typeof Card;
        'holochain-playground-help-button': typeof HolochainPlaygroundHelpButton;
    };
}
