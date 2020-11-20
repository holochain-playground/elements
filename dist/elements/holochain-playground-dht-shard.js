import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import 'lodash-es';
import '../types/metadata.js';
import { getDhtShard } from '../core/cell/dht/get.js';
import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { LitElement, html, property } from 'lit-element';
import '@alenaksu/json-viewer';
import { sharedStyles } from './sharedStyles.js';
import { selectCell, selectActiveCell } from '../state/selectors.js';

class DHTShard extends blackboardConnect('holochain-playground', LitElement) {
    constructor() {
        super(...arguments);
        this.cell = undefined;
    }
    static style() {
        return sharedStyles;
    }
    getCell() {
        if (this.cell) {
            return selectCell(this.blackboard.state)(this.cell.dna, this.cell.agentId);
        }
        else
            return selectActiveCell(this.blackboard.state);
    }
    render() {
        return html `
      <div class="column">
        ${this.getCell()
            ? html `
              <span>
                <strong>
                  Entries with associated metadata, and agent ids with all their
                  headers
                </strong>
              </span>
              <json-viewer id="dht-shard" style="margin-top: 16px;">
                ${JSON.stringify(getDhtShard(this.getCell().state))}
              </json-viewer>
            `
            : html `
              <span class="placeholder">
                Select a cell to see its DHT Shard
              </span>
            `}
      </div>
    `;
    }
}
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], DHTShard.prototype, "cell", void 0);
customElements.define('holochain-playground-dht-shard', DHTShard);

export { DHTShard };
//# sourceMappingURL=holochain-playground-dht-shard.js.map
