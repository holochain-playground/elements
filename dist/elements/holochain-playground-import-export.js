import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import '../_setToArray-0c1e9efa.js';
import '../core/cell/dht/get.js';
import { b as __decorate, d as __metadata } from '../tslib.es6-d17b0a4d.js';
import '../Subject-4f1cabc8.js';
import '../types/common.js';
import '../hash-7578db5d.js';
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
import '../core/cell/dht/put.js';
import '../core/cell/workflows/integrate_dht_ops.js';
import '../core/cell/workflows/app_validation.js';
import '../core/cell/workflows/sys_validation.js';
import '../core/cell/workflows/incoming_dht_ops.js';
import '../core/cell.js';
import '../core/network/p2p-cell.js';
import '../core/network.js';
import '../core/conductor.js';
import { L as LitElement, h as html } from '../lit-element-f1ebfbe2.js';
import { q as query } from '../decorators-7fa2337b.js';
import '../style-map-68ecac9c.js';
import '../mwc-button-c34eae42.js';
import '../ripple-handlers-c1500633.js';
import '../processors/message.js';
import { fileToPlayground, downloadFile } from '../processors/files.js';

class ImportExport extends blackboardConnect('holochain-playground', LitElement) {
    import() {
        const file = this.fileUpload.files[0];
        var reader = new FileReader();
        reader.onload = (event) => {
            const playground = JSON.parse(event.target.result);
            this.blackboard.updateState(fileToPlayground(playground));
        };
        reader.readAsText(file);
    }
    export() {
        const playground = this.blackboard.state;
        const blob = new Blob([JSON.stringify(playground)], {
            type: 'application/json',
        });
        downloadFile(`holochain-playground-${Date.now().toLocaleString()}.json`, blob);
    }
    render() {
        return html `
      <mwc-button
        label="Import"
        icon="publish"
        style="margin-right: 18px;"
        @click=${() => this.fileUpload.click()}
      ></mwc-button>
      <mwc-button
        label="Export"
        icon="get_app"
        style="margin-right: 18px;"
        @click=${() => this.export()}
      ></mwc-button>
      <input
        type="file"
        id="file-upload"
        accept="application/json"
        style="display:none"
        @change=${() => this.import()}
      />
    `;
    }
}
__decorate([
    query('#file-upload'),
    __metadata("design:type", HTMLInputElement)
], ImportExport.prototype, "fileUpload", void 0);
customElements.define('holochain-playground-import-export', ImportExport);

export { ImportExport };
//# sourceMappingURL=holochain-playground-import-export.js.map
