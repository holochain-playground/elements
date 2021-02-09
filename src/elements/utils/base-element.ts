import { LitElement, PropertyValues } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { PlaygroundMixin } from '@holochain-playground/container';
import { Dictionary } from '@holochain-open-dev/core-types';
import { Cell, MiddlewareSubscription } from '@holochain-playground/core';

export class BaseElement extends PlaygroundMixin(
  ScopedElementsMixin(LitElement)
) {
  protected _subscriptions: Dictionary<Array<MiddlewareSubscription>> = {};
  protected cells: Array<Cell> = [];

  /** Functions to override */

  observedCells(): Cell[] {
    return [];
  }

  onNewObservedCell(cell: Cell): MiddlewareSubscription[] {
    return [];
  }

  onCellsChanged() {}

  /** Private functionality */

  private getStrCellId(cell: Cell): string {
    return `${cell.dnaHash}/${cell.agentPubKey}`;
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    this.cells = this.observedCells().filter(cell => !!cell);
    const newCellsById: Dictionary<Cell> = this.cells.reduce(
      (acc, next) => ({ ...acc, [this.getStrCellId(next)]: next }),
      {}
    );
    const newCellsIds = Object.keys(newCellsById);
    const oldCellsIds = Object.keys(this._subscriptions);

    const addedCellsIds = newCellsIds.filter(
      (cellId) => !oldCellsIds.includes(cellId)
    );
    const removedCellsIds = oldCellsIds.filter(
      (cellId) => !newCellsIds.includes(cellId)
    );

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

  private unsubscribeFromCellId(cellId: string) {
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
