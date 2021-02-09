import { LitElement, PropertyValues } from 'lit-element';
import { Dictionary } from '@holochain-open-dev/core-types';
import { Cell, MiddlewareSubscription } from '@holochain-playground/core';
declare const BaseElement_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost> & typeof import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost & import("lit-element").Constructor<import("@holochain-playground/container").PlaygroundElement>;
export declare class BaseElement extends BaseElement_base {
    protected _subscriptions: Dictionary<Array<MiddlewareSubscription>>;
    protected cells: Array<Cell>;
    /** Functions to override */
    observedCells(): Cell[];
    onNewObservedCell(cell: Cell): MiddlewareSubscription[];
    onCellsChanged(): void;
    /** Private functionality */
    private getStrCellId;
    updated(changedValues: PropertyValues): void;
    private unsubscribeFromCellId;
    disconnectedCallback(): void;
}
export {};
