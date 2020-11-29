import { LitElement, query, html, property } from 'lit-element';

import '@material/mwc-button';
import { downloadFile, fileToPlayground } from '../processors/files';
import { Conductor } from '../core/conductor';
import { consumePlayground, PlaygroundContext, UpdateContextEvent } from './utils/context';

@consumePlayground()
export class ImportExport extends LitElement {
  @property({ type: String })
  private activeDna: string | undefined;
  @property({ type: String })
  private activeAgentPubKey: string | undefined;
  @property({ type: String })
  private activeEntryHash: string | undefined;
  @property({ type: Array })
  private conductors: Conductor[] | undefined;

  @property({ type: Array })
  private conductorsUrls: string[] | undefined;

  @query('#file-upload')
  private fileUpload: HTMLInputElement;

  import() {
    const file = this.fileUpload.files[0];

    var reader = new FileReader();
    reader.onload = (event) => {
      const playground = JSON.parse(event.target.result as string);

      this.dispatchEvent(new UpdateContextEvent(fileToPlayground(playground)));
    };
    reader.readAsText(file);
  }

  export() {
    const playground: PlaygroundContext = {
      activeAgentPubKey: this.activeAgentPubKey,
      activeDna: this.activeDna,
      activeEntryHash: this.activeEntryHash,
      conductors: this.conductors,
      conductorsUrls: this.conductorsUrls,
    };

    const blob = new Blob([JSON.stringify(playground)], {
      type: 'application/json',
    });

    downloadFile(
      `holochain-playground-${Date.now().toLocaleString()}.json`,
      blob
    );
  }

  render() {
    return html`
      <mwc-button
        label="Import"
        icon="publish"
        style="margin-right: 18px;"
        @click=${() => this.fileUpload.click()}
      ></mwc-button>
      <mwc-button
        label="Export"
        icon="get_app"
        style="margin-right: 18px;"
        @click=${() => this.export()}
      ></mwc-button>
      <input
        type="file"
        id="file-upload"
        accept="application/json"
        style="display:none"
        @change=${() => this.import()}
      />
    `;
  }
}

customElements.define('holochain-playground-import-export', ImportExport);
