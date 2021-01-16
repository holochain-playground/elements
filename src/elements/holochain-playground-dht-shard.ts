import { LitElement, property, PropertyValues, html, query } from 'lit-element';
import { sharedStyles } from './utils/shared-styles';
import { selectAllCells, selectCell } from './utils/selectors';
import { getDhtShard } from '@holochain-playground/core';

import '@alenaksu/json-viewer';
import { BaseElement } from './utils/base-element';

export class HolochainPlaygroundDhtShard extends BaseElement {
  @property({ type: Object })
  cell: { dna: string; agentId: string } = undefined;

  static style() {
    return sharedStyles;
  }

  get activeCell() {
    return (
      selectCell(this.activeDna, this.activeAgentPubKey, this.conductors) ||
      selectAllCells(this.activeDna, this.conductors)[0]
    );
  }
  render() {
    return html`
      <div class="column">
        ${this.activeCell
          ? html`
              <span>
                <strong>
                  Entries with associated metadata, and agent ids with all their
                  headers
                </strong>
              </span>
              <json-viewer id="dht-shard" style="margin-top: 16px;">
                ${JSON.stringify(getDhtShard(this.activeCell.state))}
              </json-viewer>
            `
          : html`
              <span class="placeholder">
                Select a cell to see its DHT Shard
              </span>
            `}
      </div>
    `;
  }
}
