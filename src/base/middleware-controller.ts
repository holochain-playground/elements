import {
  Cell,
  CellMap,
  ErrorMiddleware,
  Middleware,
  MiddlewareSubscription,
  SuccessMiddleware,
} from '@holochain-playground/core';
import { CellId } from '@holochain/conductor-api';
import { ReactiveController, ReactiveElement } from 'lit';

import { cellChanges } from '../store/utils';

export interface MiddlewareTypes {
  before?: Middleware<any>;
  success?: SuccessMiddleware<any>;
  error?: ErrorMiddleware<any>;
}
export interface Middlewares {
  workflow?: MiddlewareTypes;
  networkRequests?: MiddlewareTypes;
}

export class MiddlewareController implements ReactiveController {
  _cellSubscriptions = new CellMap<MiddlewareSubscription[]>();

  constructor(
    host: ReactiveElement,
    protected getCells: () => Cell | CellMap<Cell> | undefined,
    protected middlewares: Middlewares
  ) {
    host.addController(this);
  }

  hostConnected() {}

  cellMap(): CellMap<Cell> {
    let cells = this.getCells();
    if (!cells) {
      return new CellMap();
    } else if ((cells as Cell).cellId) {
      return new CellMap<Cell>([[(cells as Cell).cellId, cells as Cell]]);
    } else {
      return cells as CellMap<Cell>;
    }
  }

  hostUpdated() {
    const cells = this.cellMap();

    const { cellsToAdd, cellsToRemove } = cellChanges(
      this._cellSubscriptions.cellIds(),
      cells.cellIds()
    );

    for (const cellId of cellsToAdd) {
      const cell = cells.get(cellId);
      const subscriptions = [];

      if (this.middlewares.workflow?.before) {
        const s = cell.workflowExecutor.before(
          this.middlewares.workflow.before
        );
        subscriptions.push(s);
      }
      if (this.middlewares.workflow?.success) {
        const s = cell.workflowExecutor.success(
          this.middlewares.workflow.success
        );
        subscriptions.push(s);
      }
      if (this.middlewares.workflow?.error) {
        const s = cell.workflowExecutor.error(this.middlewares.workflow.error);
        subscriptions.push(s);
      }

      if (this.middlewares.networkRequests?.before) {
        const s = cell.p2p.networkRequestsExecutor.before(
          this.middlewares.networkRequests.before
        );
        subscriptions.push(s);
      }
      if (this.middlewares.networkRequests?.success) {
        const s = cell.p2p.networkRequestsExecutor.success(
          this.middlewares.networkRequests.success
        );
        subscriptions.push(s);
      }
      if (this.middlewares.networkRequests?.error) {
        const s = cell.p2p.networkRequestsExecutor.error(
          this.middlewares.networkRequests.error
        );
        subscriptions.push(s);
      }

      this._cellSubscriptions.put(cellId, subscriptions);
    }

    for (const cellId of cellsToRemove) {
      this.unsubscribe(cellId);
    }
  }

  hostDisconnected() {
    this._cellSubscriptions.cellIds().forEach((c) => this.unsubscribe(c));
  }

  unsubscribe(cellId: CellId) {
    const subscriptions = this._cellSubscriptions.get(cellId);

    for (const s of subscriptions) {
      s.unsubscribe();
    }
    this._cellSubscriptions.delete(cellId);
  }
}
