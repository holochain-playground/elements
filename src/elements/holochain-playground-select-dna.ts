import { LitElement, html, property } from 'lit-element';
import { Conductor } from '../core/conductor';
import { selectAllDNAs } from './utils/selectors';
import { consumePlayground, UpdateContextEvent } from './utils/context';

@consumePlayground()
export class SelectDNA extends LitElement {
  @property({ type: Array })
  private conductors: Conductor[] | undefined;
  @property({ type: String })
  private activeDna: string | undefined;

  selectDNA(dna: string) {
    this.dispatchEvent(
      new UpdateContextEvent({
        activeAgentPubKey: null,
        activeEntryHash: null,
        activeDna: dna,
      })
    );
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
                <mwc-list-item
                  ?selected=${this.activeDna === dna}
                  .value=${dna}
                  >${dna}</mwc-list-item
                >
              `
          )}
        </mwc-select>
      `;
    }
  }
}

customElements.define('holochain-playground-select-dna', SelectDNA);
