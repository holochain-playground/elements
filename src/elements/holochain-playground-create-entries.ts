import { LitElement, html, property, query, css } from 'lit-element';
import '@material/mwc-textarea';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-dialog';
import '@material/mwc-radio';
import '@material/mwc-formfield';
import { sharedStyles } from './utils/sharedStyles';
import { TextArea } from '@material/mwc-textarea';
import { TextFieldBase } from '@material/mwc-textfield/mwc-textfield-base';
import { Element } from '../types/element';

import '@alenaksu/json-viewer';
import {
  selectAllCells,
  selectCell,
  selectFromCAS,
  selectHeaderEntry,
} from './utils/selectors';
import { sampleZome } from '../dnas/sample-dna';
import { cloneDeep } from 'lodash-es';
import { DHTOp, elementToDHTOps, getDHTOpBasis } from '../types/dht-op';
import { NewEntryHeader } from '../types/header';
import { Conductor } from '../core/conductor';
import { Cell } from '../core/cell';
import { consumePlayground, UpdateContextEvent } from './utils/context';

@consumePlayground()
export class CreateEntries extends LitElement {
  @property({ type: String })
  private activeDna: string | undefined;
  @property({ type: Array })
  private conductors: Conductor[] | undefined;

  @property({ type: String })
  private activeAgentPubKey: string | undefined;
  @property({ type: Array })
  private conductorsUrls: string[] | undefined;

  @property({ attribute: false })
  private selectedEntryType: number = 0;

  @query('#create-entry-textarea')
  private createTextarea: TextArea;
  @query('#create-entry-type')
  private createType: TextFieldBase;

  @query('#update-entry-textarea')
  private updateTextarea: TextArea;
  @query('#update-header-address')
  private updateHeaderAddress: TextFieldBase;

  @query('#delete-header-address')
  private deleteHeaderAddress: TextFieldBase;

  @query('#link-from-address')
  private linkFromAddress: TextFieldBase;
  @query('#link-to-address')
  private linkToAddress: TextFieldBase;
  @query('#link-tag')
  private linkTag: TextFieldBase;

  @query('#delete-link-address')
  private deleteLinkAddress: TextFieldBase;

  zome = sampleZome;

  @property({ type: Object })
  private zomeFnToCall:
    | { fnName: string; payload: any }
    | undefined = undefined;

  @property({ type: Array })
  private dhtOpsToCreate:
    | Array<{ DHTOp: DHTOp; neighborhood: string }>
    | undefined = undefined;

  get allCells(): Cell[] {
    return selectAllCells(this.activeDna, this.conductors);
  }

  get activeCell() {
    return (
      selectCell(this.activeDna, this.activeAgentPubKey, this.conductors) ||
      this.allCells[0]
    );
  }

  setEntryValidity(element) {
    element.validityTransform = (newValue, nativeValidity) => {
      this.requestUpdate();
      if (newValue.length === 46) {
        const entry = selectFromCAS(newValue, this.allCells)(newValue);
        if (entry) return { valid: true };
      }
      element.setCustomValidity('Entry does not exist');
      return {
        valid: false,
      };
    };
  }

  setHeaderValidity(element) {
    element.validityTransform = (newValue, nativeValidity) => {
      this.requestUpdate();
      if (newValue.length === 46) {
        const header = selectFromCAS(newValue, this.allCells);
        if (header) return { valid: true };
      }
      element.setCustomValidity('Header does not exist');
      return {
        valid: false,
      };
    };
  }

  setNonEmptyValidity(element) {
    element.validityTransform = (newValue, nativeValidity) => {
      this.requestUpdate();
      if (newValue.length === 0) {
        element.setCustomValidity('Type must not be empty');
        return { valid: false };
      }
      return {
        valid: true,
      };
    };
  }

  setJsonValidity(element) {
    element.validityTransform = (newValue, nativeValidity) => {
      if (newValue === '') return { valid: false };
      try {
        const json = JSON.parse(newValue);
        element.setCustomValidity('');

        this.requestUpdate();
        return {
          valid: true,
        };
      } catch (e) {
        element.setCustomValidity('Bad JSON input');
        this.requestUpdate();
        return { valid: false };
      }
    };
  }

  firstUpdated() {
    if (this.conductorsUrls) return;

    this.setJsonValidity(this.createTextarea);
    this.setJsonValidity(this.updateTextarea);
    this.setHeaderValidity(this.updateHeaderAddress);
    this.setHeaderValidity(this.deleteHeaderAddress);
    this.setEntryValidity(this.linkFromAddress);
    this.setEntryValidity(this.linkToAddress);
    this.setHeaderValidity(this.deleteLinkAddress);
    this.setNonEmptyValidity(this.createType);
    [
      this.createTextarea,
      this.updateTextarea,
      this.updateHeaderAddress,
      this.deleteHeaderAddress,
      this.linkFromAddress,
      this.linkToAddress,
      this.deleteLinkAddress,
    ].forEach((ele) => ele['formElement'] && ele.setCustomValidity(''));
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
        hr {
          width: 100%;
          opacity: 0.3;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        mwc-textfield,
        mwc-textarea {
          margin-bottom: 16px;
        }
        mwc-textarea {
          width: 100%;
        }
      `,
    ];
  }

  renderCreateEntry() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 0 ? '' : 'display: none;'}
      >
        <h3>Create Entry</h3>
        <div class="column center-content">
          <mwc-textfield
            outlined
            id="create-entry-type"
            label="Entry Type"
            style="width: 15em"
            @input=${() => this.createType.reportValidity()}
          ></mwc-textfield>
          <mwc-textarea
            outlined
            id="create-entry-textarea"
            style="flex: 1;"
            fullwidth
            required
            @input=${() => this.createTextarea.reportValidity()}
            placeholder="Input JSON of entry"
          ></mwc-textarea>
          <mwc-button
            raised
            label="CREATE"
            .disabled=${!(
              this.createTextarea &&
              this.createTextarea.validity.valid &&
              this.createType &&
              this.createType.validity.valid
            )}
            @click=${() =>
              this.openCommitDialog('create_entry', {
                content: JSON.parse(this.createTextarea.value),
                entry_type: this.createType.value,
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderUpdateEntry() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 1 ? '' : 'display: none;'}
      >
        <h3>Update Entry</h3>
        <div class="column center-content">
          <mwc-textarea
            outlined
            id="update-entry-textarea"
            style="flex: 1;"
            fullwidth
            required
            @input=${() => this.updateTextarea.reportValidity()}
            placeholder="Input JSON of entry"
          ></mwc-textarea>
          <mwc-textfield
            outlined
            id="update-header-address"
            label="Entry to update"
            style="width: 35em"
            @input=${() => this.updateHeaderAddress.reportValidity()}
          ></mwc-textfield>
          <mwc-button
            raised
            label="UPDATE"
            .disabled=${!(
              this.updateTextarea &&
              this.updateTextarea.validity.valid &&
              this.updateHeaderAddress &&
              this.updateHeaderAddress.validity.valid
            )}
            @click=${() =>
              this.openCommitDialog('update_entry', {
                content: JSON.parse(this.updateTextarea.value),
                type: selectHeaderEntry(
                  this.updateHeaderAddress.value,
                  this.allCells
                ),
                original_header_hash: this.updateHeaderAddress.value,
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderDeleteEntry() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 2 ? '' : 'display: none;'}
      >
        <h3>Delete Entry</h3>
        <div class="column center-content">
          <mwc-textfield
            outlined
            id="delete-header-address"
            label="Entry address to remove"
            style="width: 35em"
            @input=${() => this.deleteHeaderAddress.reportValidity()}
          ></mwc-textfield>
          <mwc-button
            raised
            label="REMOVE"
            .disabled=${!(
              this.deleteHeaderAddress &&
              this.deleteHeaderAddress.validity.valid
            )}
            @click=${() =>
              this.openCommitDialog('delete_entry', {
                deletes_address: this.deleteHeaderAddress.value,
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderCreateLink() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 3 ? '' : 'display: none;'}
      >
        <h3>Create Link</h3>
        <div class="column center-content">
          <mwc-textfield
            outlined
            id="link-from-address"
            label="Base entry address"
            style="width: 35em"
            @input=${() => this.linkFromAddress.reportValidity()}
          ></mwc-textfield>
          <mwc-textfield
            outlined
            id="link-to-address"
            label="Target entry address"
            @input=${() => this.linkToAddress.reportValidity()}
            style="width: 35em"
          ></mwc-textfield>
          <mwc-textfield
            outlined
            id="link-tag"
            label="Tag of the link"
            style="width: 35em"
          ></mwc-textfield>
          <mwc-button
            raised
            label="LINK"
            .disabled=${!(
              this.linkFromAddress &&
              this.linkFromAddress.validity.valid &&
              this.linkToAddress &&
              this.linkToAddress.validity.valid
            )}
            @click=${() =>
              this.openCommitDialog('create_link', {
                base: this.linkFromAddress.value,
                target: this.linkToAddress.value,
                tag: this.linkTag.value,
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  renderDeleteLink() {
    return html`
      <div
        class="column"
        style=${this.selectedEntryType === 4 ? '' : 'display: none;'}
      >
        <h3>Delete Link</h3>
        <div class="column center-content">
          <mwc-textfield
            outlined
            id="delete-link-address"
            label="AddLink header hash"
            style="width: 35em"
            @input=${() => {
              this.deleteLinkAddress.reportValidity();
              this.requestUpdate();
            }}
          ></mwc-textfield>
          <mwc-button
            raised
            label="DELETE LINK"
            .disabled=${!(
              this.deleteLinkAddress && this.deleteLinkAddress.validity.valid
            )}
            @click=${() =>
              this.openCommitDialog('delete_link', {
                link_add_address: this.deleteLinkAddress.value,
              })}
          ></mwc-button>
        </div>
      </div>
    `;
  }

  async openCommitDialog(fnName: string, payload: any) {
    this.dhtOpsToCreate = await this.buildDHTOps(fnName, payload);

    this.zomeFnToCall = {
      fnName,
      payload,
    };
  }

  async buildDHTOps(fnName: string, payload: any) {
    const currentState = cloneDeep(this.activeCell.state);

    const actions = sampleZome[fnName](payload);

    const elementsPromises = actions.map((action) => action(currentState));

    const elements = await Promise.all(elementsPromises);

    const dhtOpsNested = elements.map(elementToDHTOps);

    const dhtOps = [].concat(...dhtOpsNested);

    return dhtOps.map((dhtOp) => ({
      DHTOp: dhtOp,
      neighborhood: getDHTOpBasis(dhtOp),
    }));
  }

  renderCommitDialog() {
    return html`
      <mwc-dialog
        .open=${!!this.zomeFnToCall}
        heading="Commit new entry"
        @closed=${() => (this.zomeFnToCall = undefined)}
      >
        <div>
          This will create these DHT Operations on the given neighborhoods
        </div>

        <json-viewer .data=${this.dhtOpsToCreate}></json-viewer>

        <mwc-button
          slot="secondaryAction"
          dialogAction="cancel"
          @click=${() => (this.zomeFnToCall = undefined)}
        >
          Cancel
        </mwc-button>
        <mwc-button
          slot="primaryAction"
          dialogAction="confirm"
          @click=${() => this.callZomeFunction()}
        >
          Commit entry
        </mwc-button>
      </mwc-dialog>
    `;
  }

  async callZomeFunction() {
    const element: Element = await this.activeCell.callZomeFn({
      zome: 'sample',
      cap: null,
      fnName: this.zomeFnToCall.fnName,
      payload: this.zomeFnToCall.payload,
    });

    this.dispatchEvent(
      new CustomEvent('element-created', {
        detail: {
          element,
        },
        bubbles: true,
        composed: true,
      })
    );

    if ((element.header as NewEntryHeader).entry_hash) {
      this.dispatchEvent(
        new UpdateContextEvent({
          activeEntryHash: (element.header as NewEntryHeader).entry_hash,
        })
      );
    }
    this.zomeFnToCall = undefined;
  }

  renderSelectCommitType() {
    return html`
      <div class="column" style="margin-right: 16px;">
        <h3 style="margin-block-end: 0.7em;">Commit type</h3>
        <mwc-formfield label="Create Entry">
          <mwc-radio
            name="entryType"
            checked
            @change=${() => (this.selectedEntryType = 0)}
          ></mwc-radio>
        </mwc-formfield>
        <mwc-formfield label="Update Entry">
          <mwc-radio
            name="entryType"
            @change=${() => (this.selectedEntryType = 1)}
          ></mwc-radio>
        </mwc-formfield>
        <mwc-formfield label="Remove Entry">
          <mwc-radio
            name="entryType"
            @change=${() => (this.selectedEntryType = 2)}
          ></mwc-radio>
        </mwc-formfield>
        <mwc-formfield label="Link Entries">
          <mwc-radio
            name="entryType"
            @change=${() => (this.selectedEntryType = 3)}
          ></mwc-radio>
        </mwc-formfield>
        <mwc-formfield label="Remove Links">
          <mwc-radio
            name="entryType"
            @change=${() => (this.selectedEntryType = 4)}
          ></mwc-radio>
        </mwc-formfield>
      </div>
    `;
  }

  renderConnectedPlaceholder() {
    return html`<div class="row fill center-content">
      <span class="placeholder"
        >Cannot create when connected to real conductors</span
      >
    </div>`;
  }

  render() {
    return html`
      <div class="column fill">
        ${this.conductorsUrls !== undefined
          ? this.renderConnectedPlaceholder()
          : html`
              <div class="row fill">
                ${this.zomeFnToCall ? this.renderCommitDialog() : html``}
                ${this.renderSelectCommitType()}

                <div class="fill" style="padding: 0 24px;">
                  ${this.renderCreateEntry()} ${this.renderUpdateEntry()}
                  ${this.renderDeleteEntry()} ${this.renderCreateLink()}
                  ${this.renderDeleteLink()}
                </div>
              </div>
            `}
      </div>
    `;
  }
}

customElements.define('holochain-playground-create-entries', CreateEntries);
