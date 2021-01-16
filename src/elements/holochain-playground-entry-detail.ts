import { LitElement, html, property, css } from 'lit-element';
import '@alenaksu/json-viewer';

import { getEntryDetails } from '@holochain-playground/core';
import { sharedStyles } from './utils/shared-styles';
import { selectAllCells, selectFromCAS } from './utils/selectors';
import { BaseElement } from './utils/base-element';

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

  shorten(object: any, length: number) {
    if (object && typeof object === 'object') {
      object = { ...object };
      for (const key of Object.keys(object)) {
        object[key] = this.shorten(object[key], length);
      }
    } else if (typeof object === 'string' && object.length > length + 3) {
      return (object as string).substring(0, length) + '...';
    }
    return object;
  }

  render() {
    return html`
      <div class="column fill">
        <h3 class="title">Entry Detail</h3>
        ${this.activeEntry
          ? html`
              <div class="column">
                <strong style="margin-bottom: 8px;">
                  ${this.activeEntry.prev_header ? 'Header' : 'Entry'} Hash
                </strong>
                <span style="margin-bottom: 16px;">
                  ${this.shorten(this.activeEntryHash, 50)}
                </span>
                <json-viewer
                  .data=${this.shorten(this.activeEntry, 40)}
                ></json-viewer>
                ${this.withMetadata
                  ? html` <span style="margin: 16px 0; font-weight: bold;">
                        Metadata
                      </span>
                      <json-viewer
                        .data=${this.shorten(this.activeEntryDetails, 40)}
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
    `;
  }

  static get scopedElements() {
    return {};
  }
}
