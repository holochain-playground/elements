import '../types/common.js';
import '../processors/hash.js';
import 'byte-base64';
import '../types/entry.js';
import '../types/header.js';
import '../types/timestamp.js';
import '../core/cell/source-chain/utils.js';
import '../core/cell/source-chain/builder-headers.js';
import '../core/cell/source-chain/put.js';
import '../types/dht-op.js';
import '../core/cell/source-chain/get.js';
import '../core/cell/workflows/publish_dht_ops.js';
import '../core/cell/workflows/produce_dht_ops.js';
import '../core/cell/workflows/genesis.js';
import '../executor/immediate-executor.js';
import '../core/cell/workflows/call_zome_fn.js';
import '../types/cell-state.js';
import '../types/metadata.js';
import 'lodash-es';
import '../core/cell/dht/get.js';
import '../core/cell/dht/put.js';
import '../core/cell/workflows/integrate_dht_ops.js';
import '../core/cell/workflows/app_validation.js';
import '../core/cell/workflows/sys_validation.js';
import '../core/cell/workflows/incoming_dht_ops.js';
import 'rxjs';
import '../core/cell.js';
import '../core/network/p2p-cell.js';
import '../core/network.js';
import '../core/conductor.js';
import '../core/cell/source-chain/actions.js';
import '../dnas/sample-dna.js';
import { U as UpdateContextEvent, _ as __decorate, a as __metadata, c as consumePlayground } from '../context-97eb5dfe.js';
import { LitElement, html, property } from 'lit-element';
import 'lit-context';
import '@material/mwc-snackbar';
import '@material/mwc-circular-progress';
import '../processors/message.js';
import '../processors/create-conductors.js';
import '../processors/build-simulated-playground.js';
import { selectAllDNAs } from './utils/selectors.js';

let SelectDNA = class SelectDNA extends LitElement {
    selectDNA(dna) {
        this.dispatchEvent(new UpdateContextEvent({
            activeAgentPubKey: null,
            activeEntryHash: null,
            activeDna: dna,
        }));
    }
    render() {
        const dnas = selectAllDNAs(this.conductors);
        if (dnas.length === 1)
            return html `<span>DNA: ${dnas[0]}</span>`;
        else {
            return html `
        <span style="margin-right: 16px;">DNA</span>
        <mwc-select
          outlined
          style="width: 28em; position: absolute; top: 4px;"
          fullwidth
          @selected=${(e) => this.selectDNA(dnas[e.detail.index])}
        >
          ${dnas.map((dna) => html `
                <mwc-list-item
                  ?selected=${this.activeDna === dna}
                  .value=${dna}
                  >${dna}</mwc-list-item
                >
              `)}
        </mwc-select>
      `;
        }
    }
};
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], SelectDNA.prototype, "conductors", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], SelectDNA.prototype, "activeDna", void 0);
SelectDNA = __decorate([
    consumePlayground()
], SelectDNA);
customElements.define('holochain-playground-select-dna', SelectDNA);

export { SelectDNA };
//# sourceMappingURL=holochain-playground-select-dna.js.map
