import { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-circular-progress';

import { blackboardContainer } from '../blackboard/blackboard-container';
import {
  LitElement,
  html,
  css,
  query,
  property,
  PropertyValues,
} from 'lit-element';
import { Playground } from '../state/playground';
//import { connectToConductors } from '../processors/connect-to-conductors';
import {
  serializePlayground,
  deserializePlayground,
} from '../processors/serialize';
import { Blackboard } from '../blackboard/blackboard';
import { buildSimulatedPlayground } from '../processors/build-simulated-playground';
import { Conductor } from '../core/conductor';

export class PlaygroundContainer extends blackboardContainer<Playground>(
  'holochain-playground',
  LitElement
) {
  @property({ type: Array })
  private initialConductors: Conductor[] | undefined;

  @property({ type: Number })
  numberOfSimulatedConductors: number = 10;

  @property({ type: Array })
  conductorsUrls: string[] | undefined;

  @query('#snackbar')
  private snackbar: Snackbar;

  @property({ type: String })
  private message: string | undefined;

  static get styles() {
    return css`
      :host {
        display: contents;
      }
    `;
  }

  buildBlackboard() {
    const initialPlayground: Playground = {
      activeAgentId: undefined,
      activeDNA: undefined,
      activeEntryId: undefined,
      conductors: [],
      conductorsUrls: this.conductorsUrls,
    };

    return new Blackboard(
      initialPlayground /* {
      persistId: 'holochain-playground',
      serializer: serializePlayground,
      deserializer: deserializePlayground,
    } */
    );
  }

  async firstUpdated() {
    if (!this.conductorsUrls) {
      this.initialConductors = await buildSimulatedPlayground(
        this.numberOfSimulatedConductors
      );

      const dnaHash = this.initialConductors[0].cells[0].cell.dnaHash;

      this.blackboard.update('activeDNA', dnaHash);
      this.blackboard.update('conductors', this.initialConductors);

      this.dispatchEvent(new CustomEvent('ready'));
    }

    this.blackboard.select('conductorsUrls').subscribe(async (urls) => {
      if (urls !== undefined) {
        try {
          // await connectToConductors(this.blackboard, urls);
        } catch (e) {
          console.error(e);
          this.showError('Error when connecting with the nodes');
        }
      }
    });
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    if (changedValues.has('conductorsUrls')) {
      this.blackboard.update('conductorsUrls', this.conductorsUrls);
    }
  }

  showError(error: string) {
    this.message = error;
    this.snackbar.show();
  }

  renderSnackbar() {
    return html`
      <mwc-snackbar id="snackbar" labelText=${this.message}>
        <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
      </mwc-snackbar>
    `;
  }

  render() {
    return html`
      ${this.renderSnackbar()}
      ${this.blackboard.state
        ? html` <slot></slot> `
        : html` <mwc-circular-progress></mwc-circular-progress>`}
    `;
  }
}

customElements.define('holochain-playground-container', PlaygroundContainer);
