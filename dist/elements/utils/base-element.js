import { LitElement } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { PlaygroundMixin } from '@holochain-playground/container';

class BaseElement extends PlaygroundMixin(ScopedElementsMixin(LitElement)) {
    constructor() {
        super(...arguments);
        this._subscriptions = {};
        this.cells = [];
    }
    /** Functions to override */
    observedCells() {
        return [];
    }
    onNewObservedCell(cell) {
        return [];
    }
    onCellsChanged() { }
    /** Private functionality */
    getStrCellId(cell) {
        return `${cell.dnaHash}/${cell.agentPubKey}`;
    }
    updated(changedValues) {
        super.updated(changedValues);
        this.cells = this.observedCells().filter(cell => !!cell);
        const newCellsById = this.cells.reduce((acc, next) => ({ ...acc, [this.getStrCellId(next)]: next }), {});
        const newCellsIds = Object.keys(newCellsById);
        const oldCellsIds = Object.keys(this._subscriptions);
        const addedCellsIds = newCellsIds.filter((cellId) => !oldCellsIds.includes(cellId));
        const removedCellsIds = oldCellsIds.filter((cellId) => !newCellsIds.includes(cellId));
        for (const addedCellId of addedCellsIds) {
            const cell = newCellsById[addedCellId];
            const defaultSubscription = cell.workflowExecutor.before(async () => {
                this.requestUpdate();
            });
            this._subscriptions[addedCellId] = [
                ...this.onNewObservedCell(cell),
                defaultSubscription,
            ];
        }
        removedCellsIds.forEach((cellId) => this.unsubscribeFromCellId(cellId));
        if (addedCellsIds.length > 1 || removedCellsIds.length > 1)
            this.onCellsChanged();
    }
    unsubscribeFromCellId(cellId) {
        for (const signalSubscription of this._subscriptions[cellId]) {
            signalSubscription.unsubscribe();
        }
        this._subscriptions[cellId] = undefined;
        delete this._subscriptions[cellId];
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        for (const cellSubscriptions of Object.values(this._subscriptions)) {
            for (const signalSubscription of cellSubscriptions) {
                signalSubscription.unsubscribe();
            }
        }
    }
}

export { BaseElement };
//# sourceMappingURL=base-element.js.map
