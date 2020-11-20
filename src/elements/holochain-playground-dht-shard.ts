import { LitElement, property, PropertyValues, html, query } from 'lit-element';
import { sharedStyles } from './utils/sharedStyles';
import { selectAllCells, selectCell } from './utils/selectors';

import '@alenaksu/json-viewer';
import { getDhtShard } from '../core/cell/dht/get';
import { Conductor } from '../core/conductor';
import { consumePlayground } from './utils/context';

@consumePlayground()
export class DHTShard extends LitElement {
  @property({ type: String })
  private activeDna: string | undefined;
  @property({ type: Array })
  private conductors: Conductor[] | undefined;
  @property({ type: String })
  private activeAgentPubKey: string | undefined;

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

customElements.define('holochain-playground-dht-shard', DHTShard);
