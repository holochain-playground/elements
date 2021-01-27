import { LitElement } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { PlaygroundMixin } from '@holochain-playground/container';
import { Dictionary } from '@holochain-open-dev/core-types';
import { Subscription } from 'rxjs';
import { Cell, CellSignal, Workflow } from '@holochain-playground/core';

export class BaseElement extends PlaygroundMixin(
  ScopedElementsMixin(LitElement)
) {
  protected _subscriptions: Dictionary<Dictionary<Subscription>> = {};

  subscribeToCell(
    cell: Cell,
    signals: CellSignal[] = ['after-workflow-executed'],
    callback?: (task: Workflow) => void
  ) {
    const cellId = `${cell.dnaHash}/${cell.agentPubKey}`;

    if (!this._subscriptions[cellId]) this._subscriptions[cellId] = {};

    for (const signal of signals) {
      if (!this._subscriptions[cellId][signal])
        this._subscriptions[cellId][signal] = cell.signals[signal].subscribe(
          (t) => {
            this.requestUpdate();
            if (callback) callback(t);
          }
        );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    for (const cellSubscriptions of Object.values(this._subscriptions)) {
      for (const signalSubscription of Object.values(cellSubscriptions)) {
        signalSubscription.unsubscribe();
      }
    }
  }
}
