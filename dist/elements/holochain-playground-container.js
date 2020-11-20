import { blackboardContainer } from '../blackboard/blackboard-container.js';
import 'lodash-es';
import 'rxjs';
import 'rxjs/operators';
import { Blackboard } from '../blackboard/blackboard.js';
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
import '../core/cell/dht/get.js';
import '../core/cell/dht/put.js';
import '../core/cell/workflows/integrate_dht_ops.js';
import '../core/cell/workflows/app_validation.js';
import '../core/cell/workflows/sys_validation.js';
import '../core/cell/workflows/incoming_dht_ops.js';
import '../core/cell.js';
import '../core/network/p2p-cell.js';
import '../core/network.js';
import '../core/conductor.js';
import '../core/cell/source-chain/actions.js';
import '../dnas/sample-dna.js';
import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { css, html, property, query, LitElement } from 'lit-element';
import { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-circular-progress';
import '../processors/message.js';
import '../processors/create-conductors.js';
import { buildSimulatedPlayground } from '../processors/build-simulated-playground.js';

class PlaygroundContainer extends blackboardContainer('holochain-playground', LitElement) {
    constructor() {
        super(...arguments);
        this.numberOfSimulatedConductors = 10;
    }
    static get styles() {
        return css `
      :host {
        display: contents;
      }
    `;
    }
    buildBlackboard() {
        const initialPlayground = {
            activeAgentId: undefined,
            activeDNA: undefined,
            activeEntryId: undefined,
            conductors: [],
            conductorsUrls: this.conductorsUrls,
        };
        return new Blackboard(initialPlayground /* {
        persistId: 'holochain-playground',
        serializer: serializePlayground,
        deserializer: deserializePlayground,
      } */);
    }
    async firstUpdated() {
        if (!this.conductorsUrls) {
            this.initialConductors = await buildSimulatedPlayground(this.numberOfSimulatedConductors);
            const dnaHash = this.initialConductors[0].cells[0].cell.dnaHash;
            this.blackboard.update('activeDNA', dnaHash);
            this.blackboard.update('conductors', this.initialConductors);
            this.dispatchEvent(new CustomEvent('ready', {
                bubbles: true,
                composed: true,
                detail: {
                    conductors: this.blackboard.state.conductors,
                },
            }));
        }
        this.blackboard.select('conductorsUrls').subscribe(async (urls) => {
        });
    }
    updated(changedValues) {
        super.updated(changedValues);
        if (changedValues.has('conductorsUrls')) {
            this.blackboard.update('conductorsUrls', this.conductorsUrls);
        }
    }
    showError(error) {
        this.message = error;
        this.snackbar.show();
    }
    renderSnackbar() {
        return html `
      <mwc-snackbar id="snackbar" labelText=${this.message}>
        <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
      </mwc-snackbar>
    `;
    }
    render() {
        return html `
      ${this.renderSnackbar()}
      ${this.blackboard.state
            ? html ` <slot></slot> `
            : html ` <mwc-circular-progress></mwc-circular-progress>`}
    `;
    }
}
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], PlaygroundContainer.prototype, "initialConductors", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Number)
], PlaygroundContainer.prototype, "numberOfSimulatedConductors", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], PlaygroundContainer.prototype, "conductorsUrls", void 0);
__decorate([
    query('#snackbar'),
    __metadata("design:type", Snackbar)
], PlaygroundContainer.prototype, "snackbar", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], PlaygroundContainer.prototype, "message", void 0);
customElements.define('holochain-playground-container', PlaygroundContainer);

export { PlaygroundContainer };
//# sourceMappingURL=holochain-playground-container.js.map
