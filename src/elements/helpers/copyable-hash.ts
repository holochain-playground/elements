import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement, property, query } from 'lit-element';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { Snackbar } from 'scoped-material-components/mwc-snackbar';
import { sharedStyles } from '../utils/shared-styles';

export class CopyableHash extends ScopedElementsMixin(LitElement) {
  @property({ type: String })
  hash!: string;

  @query('#copy-notification')
  _copyNotification: Snackbar;

  async copyHash() {
    await navigator.clipboard.writeText(this.hash);
    this._copyNotification.show();
  }

  render() {
    return html`
      <mwc-snackbar
        id="copy-notification"
        labelText="Hash copied to clipboard"
      ></mwc-snackbar>
      <div class="row center-content">
        <span style="font-family: monospace;">${this.hash.substring(0, 8)}...</span>
        <mwc-icon-button
          style="--mdc-icon-button-size	: 24px; --mdc-icon-size: 20px;"
          icon="content_copy"
          @click=${() => this.copyHash()}
        ></mwc-icon-button>
      </div>
    `;
  }

  static get styles() {
    return sharedStyles;
  }

  static get scopedElements() {
    return {
      'mwc-icon-button': IconButton,
      'mwc-snackbar': Snackbar,
    };
  }
}
