import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { css, html, property } from 'lit-element';
import { J as JsonViewer } from '../json-viewer-d616c533.js';
import { getEntryDetails } from '@holochain-playground/core';
import { sharedStyles } from './utils/shared-styles.js';
import { selectAllCells, selectFromCAS } from './utils/selectors.js';
import { PlaygroundElement } from './utils/playground-element.js';
import { Card } from 'scoped-material-components/mwc-card';
import { shortenStrRec } from './utils/hash.js';
import 'lodash-es';
import '@open-wc/scoped-elements';
import '@holochain-playground/container';

class EntryDetail extends PlaygroundElement {
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
    get activeEntry() {
        const allCells = selectAllCells(this.activeDna, this.conductors);
        return selectFromCAS(this.activeEntryHash, allCells);
    }
    get activeEntryDetails() {
        const allCells = selectAllCells(this.activeDna, this.conductors);
        for (const cell of allCells) {
            const details = getEntryDetails(cell.state, this.activeEntryHash);
            if (details)
                return details;
        }
        return undefined;
    }
    render() {
        return html `
      <mwc-card style="width: auto; min-height: 200px;" class="fill">
        <div class="column fill" style="padding: 16px;">
          <span class="title">Entry Detail</span>
          ${this.activeEntry
            ? html `
                <div class="column fill">
                  <span style="margin-bottom: 16px;">
                    ${this.activeEntry.prev_header ? 'Header' : 'Entry'} Hash:
                    ${this.activeEntryHash}
                  </span>
                  <div class="fill flex-scrollable-parent">
                    <div class="flex-scrollable-container">
                      <div class="flex-scrollable-y" style="height: 100%;">
                        <json-viewer
                          .object=${shortenStrRec(this.activeEntry)}
                          class="fill"
                        ></json-viewer>
                      </div>
                    </div>
                  </div>
                  ${this.withMetadata
                ? html ` <span style="margin: 16px 0; font-weight: bold;">
                          Metadata
                        </span>
                        <json-viewer
                          .object=${shortenStrRec(this.activeEntryDetails)}
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
      </mwc-card>
    `;
    }
    static get scopedElements() {
        return {
            'json-viewer': JsonViewer,
            'mwc-card': Card,
        };
    }
}
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], EntryDetail.prototype, "withMetadata", void 0);

export { EntryDetail };
//# sourceMappingURL=entry-detail.js.map
