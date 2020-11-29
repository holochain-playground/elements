import { css, html, property, query } from 'lit-element';
import { ContextProvider, createContext } from 'lit-context';
import { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-circular-progress';
import { buildSimulatedPlayground } from './processors/build-simulated-playground.js';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

class Playgroundprovider extends ContextProvider {
    constructor() {
        super(...arguments);
        this.numberOfSimulatedConductors = 10;
        this.conductors = [];
    }
    get contextValue() {
        return {
            activeDna: this.activeDna,
            activeAgentPubKey: this.activeAgentPubKey,
            activeEntryHash: this.activeEntryHash,
            conductors: this.conductors,
            conductorsUrls: this.conductorsUrls,
        };
    }
    static get styles() {
        return css `
      :host {
        display: contents;
      }
    `;
    }
    async firstUpdated() {
        if (!this.conductorsUrls) {
            this.conductors = await buildSimulatedPlayground(this.numberOfSimulatedConductors);
            this.activeDna = this.conductors[0].cells[0].cell.dnaHash;
            this.dispatchEvent(new CustomEvent('ready', {
                bubbles: true,
                composed: true,
                detail: this.contextValue,
            }));
        }
        this.addEventListener('update-context', (e) => {
            const keys = Object.keys(e.detail);
            for (const key of keys) {
                this[key] = e.detail[key];
            }
        });
        /*
        this.blackboard.select('conductorsUrls').subscribe(async (urls) => {
          if (urls !== undefined) {
            try {
              // await connectToConductors(this.blackboard, urls);
            } catch (e) {
              console.error(e);
              this.showError('Error when connecting with the nodes');
            }
          }
        }); */
    }
    updated(values) {
        super.updated(values);
        this.context.setValue(this.contextValue);
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
      ${this.conductors
            ? html ` <slot></slot> `
            : html ` <mwc-circular-progress></mwc-circular-progress>`}
    `;
    }
}
__decorate([
    property({ type: Number }),
    __metadata("design:type", Number)
], Playgroundprovider.prototype, "numberOfSimulatedConductors", void 0);
__decorate([
    query('#snackbar'),
    __metadata("design:type", Snackbar)
], Playgroundprovider.prototype, "snackbar", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], Playgroundprovider.prototype, "message", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], Playgroundprovider.prototype, "activeDna", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], Playgroundprovider.prototype, "activeAgentPubKey", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], Playgroundprovider.prototype, "activeEntryHash", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], Playgroundprovider.prototype, "conductors", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Array)
], Playgroundprovider.prototype, "conductorsUrls", void 0);
customElements.define('holochain-playground-provider', Playgroundprovider);

// Create a context
const { consume: consumePlayground } = createContext('holochain-playground', {
    activeDna: undefined,
    activeAgentPubKey: undefined,
    activeEntryHash: undefined,
    conductors: [],
    conductorsUrls: undefined,
});
class UpdateContextEvent extends CustomEvent {
    constructor(context) {
        super('update-context', {
            bubbles: true,
            composed: true,
            detail: context,
        });
    }
}

export { Playgroundprovider as P, UpdateContextEvent as U, __decorate as _, __metadata as a, consumePlayground as c };
//# sourceMappingURL=context-97eb5dfe.js.map
