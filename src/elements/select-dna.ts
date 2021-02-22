import { LitElement, html, property } from 'lit-element';
import { PlaygroundElement } from '../context/playground-element';
import { selectAllDNAs } from './utils/selectors';
import { Select } from 'scoped-material-components/mwc-select';
import { ListItem } from 'scoped-material-components/mwc-list-item';

export class SelectDNA extends PlaygroundElement {
  selectDNA(dna: string) {
    this.updatePlayground({
      activeAgentPubKey: null,
      activeHash: null,
      activeDna: dna,
    });
  }

  render() {
    const dnas = selectAllDNAs(this.conductors);
    if (dnas.length === 1) return html`<span>DNA: ${dnas[0]}</span>`;
    else {
      return html`
        <span style="margin-right: 16px;">DNA</span>
        <mwc-select
          outlined
          style="width: 28em; position: absolute; top: 4px;"
          fullwidth
          @selected=${(e) => this.selectDNA(dnas[e.detail.index])}
        >
          ${dnas.map(
            (dna) =>
              html`
                <mwc-list-item ?selected=${this.activeDna === dna} .value=${dna}
                  >${dna}</mwc-list-item
                >
              `
          )}
        </mwc-select>
      `;
    }
  }

  static get scopedElements() {
    return {
      'mwc-list-item': ListItem,
      'mwc-select': Select,
    };
  }
}
