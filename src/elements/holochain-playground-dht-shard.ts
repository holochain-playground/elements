import { LitElement, property, PropertyValues, html, query } from 'lit-element';
import { sharedStyles } from './sharedStyles';
import { Playground } from '../state/playground';
import { blackboardConnect } from '../blackboard/blackboard-connect';
import { selectActiveCell, selectCell } from '../state/selectors';
import { Cell } from '../core/cell';

import '@alenaksu/json-viewer';

export class DHTShard extends blackboardConnect<Playground>(
  'holochain-playground',
  LitElement
) {
  @property({ type: Object })
  cell: { dna: string; agentId: string } = undefined;

  static style() {
    return sharedStyles;
  }

  getCell() {
    if (this.cell) {
      return selectCell(this.blackboard.state)(
        this.cell.dna,
        this.cell.agentId
      );
    } else return selectActiveCell(this.blackboard.state);
  }

  render() {
    return html`
      <div class="column">
        ${this.getCell()
          ? html`
              <span>
                <strong>
                  Entries with associated metadata, and agent ids with all their
                  headers
                </strong>
              </span>
              <json-viewer id="dht-shard" style="margin-top: 16px;">
                ${JSON.stringify(this.getCell().getDHTShard())}
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

customElements.define('holochain-playground-dht-shard', DHTShard);
