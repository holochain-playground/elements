import { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-circular-progress';

import { LitElement, html, css, query, property } from 'lit-element';
//import { connectToConductors } from '../processors/connect-to-conductors';
import {
  serializePlayground,
  deserializePlayground,
} from '../processors/serialize';
import { buildSimulatedPlayground } from '../processors/build-simulated-playground';
import { Conductor } from '../core/conductor';
import './utils/context';
import { ContextProvider } from 'lit-context';

export class Playgroundprovider extends ContextProvider {
  @property({ type: Number })
  numberOfSimulatedConductors: number = 10;

  @query('#snackbar')
  private snackbar: Snackbar;

  @property({ type: String })
  private message: string | undefined;

  /** Context variables */
  @property({ type: String })
  private activeDna: string | undefined;
  @property({ type: String })
  private activeAgentPubKey: string | undefined;
  @property({ type: String })
  private activeEntryHash: string | undefined;
  @property({ type: Array })
  private conductors: Conductor[] = [];

  @property({ type: Array })
  conductorsUrls: string[] | undefined;

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
    return css`
      :host {
        display: contents;
      }
    `;
  }

  async firstUpdated() {
    if (!this.conductorsUrls) {
      this.conductors = await buildSimulatedPlayground(
        this.numberOfSimulatedConductors
      );

      this.activeDna = this.conductors[0].cells[0].cell.dnaHash;

      this.dispatchEvent(
        new CustomEvent('ready', {
          bubbles: true,
          composed: true,
          detail: this.contextValue,
        })
      );
    }

    this.addEventListener('update-context', (e: CustomEvent) => {
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
      ${this.conductors
        ? html` <slot></slot> `
        : html` <mwc-circular-progress></mwc-circular-progress>`}
    `;
  }
}

customElements.define('holochain-playground-provider', Playgroundprovider);
