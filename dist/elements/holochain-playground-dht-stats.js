import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import 'lodash-es';
import 'rxjs';
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
import { sampleDna } from '../dnas/sample-dna.js';
import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { LitElement, html, query, property } from 'lit-element';
import { Dialog } from '@material/mwc-dialog';
import { sharedStyles } from './sharedStyles.js';
import { selectRedundancyFactor, selectCellCount, selectActiveCellsForConductor, selectUniqueDHTOps, selectMedianHoldingDHTOps, selectGlobalDHTOps } from '../state/selectors.js';
import { TextFieldBase } from '@material/mwc-textfield/mwc-textfield-base';
import '../processors/message.js';
import { createConductors } from '../processors/create-conductors.js';
import '@material/mwc-linear-progress';

class DHTStats extends blackboardConnect('holochain-playground', LitElement) {
    constructor() {
        super(...arguments);
        this.processing = false;
    }
    static get styles() {
        return sharedStyles;
    }
    renderStatsHelp() {
        return html `
      <mwc-dialog id="stats-help" heading="DHT Statistics Help">
        <span>
          This panel contains statistics for the current state of the DHT.
          <br />
          <br />
          Having a redundancy factor of
          ${selectRedundancyFactor(this.blackboard.state)}, it will
          <strong>
            replicate every DHT Op in the
            ${selectRedundancyFactor(this.blackboard.state)} nodes that are
            closest to its neighborhood </strong
          >.
          <br />
          <br />
          The number of
          <strong
            >DHT Ops (DHT Operation Transforms) is a measure of the load that
            the DHT has to hold</strong
          >. A DHT Op is the command that a node receives to indicate it has to
          change something in its shard of the DHT. Example of DHT Ops are
          "StoreEntry", "RegisterAddLink".
        </span>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
    }
    async republish() {
        const newNodes = parseInt(this.nNodes.value);
        const currentNodes = selectCellCount(this.blackboard.state);
        const changedNodes = currentNodes !== newNodes;
        const rFactor = parseInt(this.rFactor.value);
        const dna = this.blackboard.state.activeDNA;
        let conductors = this.blackboard.state.conductors;
        if (newNodes > currentNodes) {
            const newNodesToCreate = newNodes - currentNodes;
            conductors = await createConductors(newNodesToCreate, conductors, sampleDna());
        }
        else if (newNodes < currentNodes) {
            const conductorsToRemove = currentNodes - newNodes;
            const getMaxSourceChainLength = (conductor) => Math.max(...selectActiveCellsForConductor(this.blackboard.state)(conductor).map((cell) => cell.state.sourceChain.length));
            conductors = conductors.sort((c1, c2) => getMaxSourceChainLength(c1) - getMaxSourceChainLength(c2));
            conductors.splice(0, conductorsToRemove);
        }
        if (changedNodes) {
            const peers = conductors.map((c) => c.cells[dna].agentId);
            for (const conductor of conductors) {
                conductor.cells[dna].peers = peers.filter((p) => p !== conductor.cells[dna].agentId);
            }
        }
        this.blackboard.update('conductors', conductors);
        if (changedNodes ||
            selectRedundancyFactor(this.blackboard.state) !== rFactor) {
            const cells = conductors.map((c) => c.cells[dna]);
            for (const cell of cells) {
                cell.DHTOpTransforms = {};
                cell.redundancyFactor = rFactor;
            }
            for (const cell of cells) {
                cell.republish();
            }
        }
        this.processing = false;
    }
    updateDHTStats() {
        this.processing = true;
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.republish();
        }, 400);
    }
    render() {
        return html `
      ${this.renderStatsHelp()}
      <div class="column" style="position: relative;">
        <div style="padding: 16px;">
          <h3 class="title">Global DHT Stats</h3>

          <mwc-icon-button
            style="position: absolute; right: 8px; top: 8px;"
            icon="help_outline"
            @click=${() => (this.statsHelp.open = true)}
          ></mwc-icon-button>

          <div class="row center-content">
            <div class="row center-content" style="padding-right: 16px;">
              <span style="margin-right: 8px;">Number of nodes: </span
              ><mwc-textfield
                id="number-of-nodes"
                min="1"
                max="50"
                outlined
                type="number"
                style="width: 5em;"
                .disabled=${this.blackboard.state.conductorsUrls !== undefined}
                @change=${() => this.updateDHTStats()}
                .value=${selectCellCount(this.blackboard.state).toString()}
              ></mwc-textfield>
            </div>
            <div class="row center-content" style="padding-right: 24px;">
              <span style="margin-right: 8px;">Redundancy factor: </span
              ><mwc-textfield
                id="r-factor"
                min="1"
                max="50"
                outlined
                type="number"
                .disabled=${this.blackboard.state.conductorsUrls !== undefined}
                style="width: 5em;"
                @change=${() => this.updateDHTStats()}
                .value=${selectRedundancyFactor(this.blackboard.state).toString()}
              ></mwc-textfield>
            </div>
            <div class="column fill">
              <span style="margin-bottom: 2px;"
                >Unique DHT Ops:
                <strong
                  >${selectUniqueDHTOps(this.blackboard.state)}</strong
                ></span
              >
              <span style="margin-bottom: 2px;"
                >Median DHT Ops per node:
                <strong
                  >${selectMedianHoldingDHTOps(this.blackboard.state)}</strong
                ></span
              >
              <span
                >Global DHT Ops:
                <strong
                  >${selectGlobalDHTOps(this.blackboard.state)}</strong
                ></span
              >
            </div>
          </div>
        </div>
        ${this.processing
            ? html `<mwc-linear-progress indeterminate></mwc-linear-progress>`
            : html ``}
      </div>
    `;
    }
}
__decorate([
    query('#stats-help'),
    __metadata("design:type", Dialog)
], DHTStats.prototype, "statsHelp", void 0);
__decorate([
    query('#number-of-nodes'),
    __metadata("design:type", TextFieldBase)
], DHTStats.prototype, "nNodes", void 0);
__decorate([
    query('#r-factor'),
    __metadata("design:type", TextFieldBase)
], DHTStats.prototype, "rFactor", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], DHTStats.prototype, "processing", void 0);
customElements.define('holochain-playground-dht-stats', DHTStats);

export { DHTStats };
//# sourceMappingURL=holochain-playground-dht-stats.js.map
