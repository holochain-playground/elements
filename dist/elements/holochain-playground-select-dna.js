import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import '../_setToArray-0c1e9efa.js';
import '../core/cell/dht/get.js';
import '../types/metadata.js';
import { L as LitElement, h as html } from '../lit-element-f1ebfbe2.js';
import { selectAllDNAs } from '../state/selectors.js';

class SelectDNA extends blackboardConnect('holochain-playground', LitElement) {
    selectDNA(dna) {
        this.blackboard.update('activeAgentId', null);
        this.blackboard.update('activeEntryId', null);
        this.blackboard.update('activeDNA', dna);
    }
    render() {
        const dnas = selectAllDNAs(this.blackboard.state);
        if (dnas.length === 1)
            return html `<span>DNA: ${dnas[0]}</span>`;
        else {
            return html `
        <span style="margin-right: 16px;">DNA</span>
        <mwc-select
          outlined
          style="width: 28em; position: absolute; top: 4px;"
          fullwidth
          @selected=${(e) => this.selectDNA(dnas[e.detail.index])}
        >
          ${dnas.map((dna) => html `
                <mwc-list-item
                  ?selected=${this.blackboard.state.activeDNA === dna}
                  .value=${dna}
                  >${dna}</mwc-list-item
                >
              `)}
        </mwc-select>
      `;
        }
    }
}
customElements.define('holochain-playground-select-dna', SelectDNA);

export { SelectDNA };
//# sourceMappingURL=holochain-playground-select-dna.js.map
