import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import 'lodash-es';
import 'rxjs';
import '../types/common.js';
import 'blakejs';
import 'byte-base64';
import '../processors/hash.js';
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
import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { LitElement, html, query } from 'lit-element';
import '@material/mwc-button';
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
