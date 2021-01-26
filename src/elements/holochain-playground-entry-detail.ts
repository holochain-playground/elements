import { LitElement, html, property, css } from 'lit-element';
import { JsonViewer } from '@power-elements/json-viewer';

import { getEntryDetails } from '@holochain-playground/core';
import { sharedStyles } from './utils/shared-styles';
import { selectAllCells, selectFromCAS } from './utils/selectors';
import { BaseElement } from './utils/base-element';
import { Card } from 'scoped-material-components/mwc-card';
import { shortenStrRec } from './utils/hash';

export class HolochainPlaygroundEntryDetail extends BaseElement {
  @property({ type: Boolean })
  withMetadata = false;

  static get styles() {
    return [
      sharedStyles,
      css`
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
      if (details) return details;
    }
    return undefined;
  }

  render() {
    return html`
      <mwc-card style="width: auto; min-height: 200px;" class="fill">
        <div class="column fill" style="padding: 16px;">
          <h3 class="title">Entry Detail</h3>
          ${this.activeEntry
            ? html`
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
                    ? html` <span style="margin: 16px 0; font-weight: bold;">
                          Metadata
                        </span>
                        <json-viewer
                          .object=${shortenStrRec(this.activeEntryDetails)}
                        ></json-viewer>`
                    : html``}
                </div>
              `
            : html`
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
