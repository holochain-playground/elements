import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import 'lodash-es';
import '../types/metadata.js';
import '../core/cell/dht/get.js';
import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { LitElement, css, html, property } from 'lit-element';
import '@alenaksu/json-viewer';
import { sharedStyles } from './sharedStyles.js';
import { selectActiveEntry, selectEntryDetails } from '../state/selectors.js';

class EntryDetail extends blackboardConnect('holochain-playground', LitElement) {
    constructor() {
        super(...arguments);
        this.withMetadata = false;
    }
    static get styles() {
        return [
            sharedStyles,
            css `
        :host {
          display: flex;
        }
      `,
        ];
    }
    shorten(object, length) {
        if (object && typeof object === 'object') {
            object = { ...object };
            for (const key of Object.keys(object)) {
                object[key] = this.shorten(object[key], length);
            }
        }
        else if (typeof object === 'string' && object.length > length + 3) {
            return object.substring(0, length) + '...';
        }
        return object;
    }
    render() {
        return html `
      <div class="column fill">
        <h3 class="title">Entry Detail</h3>
        ${selectActiveEntry(this.blackboard.state)
            ? html `
              <div class="column">
                <strong style="margin-bottom: 8px;">
                  ${selectActiveEntry(this.blackboard.state).entry_address
                ? 'Header'
                : 'Entry'}
                  Id
                </strong>
                <span style="margin-bottom: 16px;">
                  ${this.shorten(this.blackboard.state.activeEntryId, 50)}
                </span>
                <json-viewer
                  .data=${this.shorten(selectActiveEntry(this.blackboard.state), 40)}
                ></json-viewer>
                ${this.withMetadata
                ? html ` <span style="margin: 16px 0; font-weight: bold;">
                        Metadata
                      </span>
                      <json-viewer
                        .data=${this.shorten(selectEntryDetails(this.blackboard.state)(this.blackboard.state.activeEntryId), 40)}
                      ></json-viewer>`
                : html ``}
              </div>
            `
            : html `
              <div class="column fill center-content">
                <span class="placeholder">Select entry to inspect</span>
              </div>
            `}
      </div>
    `;
    }
}
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], EntryDetail.prototype, "withMetadata", void 0);
customElements.define('holochain-playground-entry-detail', EntryDetail);

export { EntryDetail };
//# sourceMappingURL=holochain-playground-entry-detail.js.map
