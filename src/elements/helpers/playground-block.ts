import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { html, LitElement } from 'lit';
import { css, property, state } from 'lit-element';
import { Card } from 'scoped-material-components/mwc-card';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { sharedStyles } from '../utils/shared-styles';

export class PlaygroundBlock extends ScopedRegistryHost(LitElement) {
  @property()
  title: string;

  @state()
  private minimized: boolean = false;

  render() {
    return html` <mwc-card class="block-card">
      <div class="column fill" style="margin: 16px;">
        <div class="row">
          <span class="block-title"
            ><slot name="title">${this.title}</slot></span
          >
          <span style="flex: 1;"></span>
          ${this.minimized ? html`` : html` <slot name="actionItem"></slot> `}
          <mwc-icon-button
            @click=${() => (this.minimized = !this.minimized)}
            .icon=${this.minimized ? 'open_fullscreen' : 'close_fullscreen'}
          ></mwc-icon-button>
        </div>
        ${this.minimized ? html`` : html` <slot></slot> `}
      </div>
    </mwc-card>`;
  }

  static styles = [sharedStyles, css``];

  static elementDefinitions = {
    'mwc-card': Card,
    'mwc-icon-button': IconButton,
  };
}
