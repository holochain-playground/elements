import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import '../_setToArray-0c1e9efa.js';
import { getDhtShard } from '../core/cell/dht/get.js';
import { b as __decorate, d as __metadata } from '../tslib.es6-d17b0a4d.js';
import '../types/metadata.js';
import { L as LitElement, h as html } from '../lit-element-f1ebfbe2.js';
import { p as property } from '../decorators-7fa2337b.js';
import '../index-e11f3d79.js';
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
