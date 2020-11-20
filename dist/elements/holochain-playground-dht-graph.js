import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import '../_setToArray-0c1e9efa.js';
import '../core/cell/dht/get.js';
import { b as __decorate, d as __metadata } from '../tslib.es6-d17b0a4d.js';
import '../hash-9f18ad5a.js';
import '../types/entry.js';
import '../types/timestamp.js';
import '../types/metadata.js';
import { L as LitElement, h as html, c as css } from '../lit-element-f1ebfbe2.js';
import { p as property, q as query, a as queryAsync, i as internalProperty, e as eventOptions, c as customElement } from '../decorators-7fa2337b.js';
import '../style-map-68ecac9c.js';
import '../observer-713e8ff5.js';
import '../mwc-button-c34eae42.js';
import { R as RippleHandlers } from '../ripple-handlers-c1500633.js';
import { D as Dialog } from '../mwc-dialog-784f4123.js';
import { sharedStyles } from './sharedStyles.js';
import { dnaNodes } from '../processors/graph.js';
import { c as cytoscape_cjs } from '../cytoscape.cjs-b95c2e04.js';
import { selectActiveCells, selectHoldingCells } from '../state/selectors.js';
import { vectorsEqual } from '../processors/utils.js';

/** @soyCompatible */
class IconButtonBase extends LitElement {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.icon = '';
        this.label = '';
        this.shouldRenderRipple = false;
        this.rippleHandlers = new RippleHandlers(() => {
            this.shouldRenderRipple = true;
            return this.ripple;
        });
    }
    /** @soyTemplate */
    renderRipple() {
        return this.shouldRenderRipple ? html `
            <mwc-ripple
                .disabled="${this.disabled}"
                unbounded>
            </mwc-ripple>` :
            '';
    }
    focus() {
        const buttonElement = this.buttonElement;
        if (buttonElement) {
            this.rippleHandlers.startFocus();
            buttonElement.focus();
        }
    }
    blur() {
        const buttonElement = this.buttonElement;
        if (buttonElement) {
            this.rippleHandlers.endFocus();
            buttonElement.blur();
        }
    }
    /** @soyTemplate */
    render() {
        return html `<button
        class="mdc-icon-button"
        aria-label="${this.label || this.icon}"
        ?disabled="${this.disabled}"
        @focus="${this.handleRippleFocus}"
        @blur="${this.handleRippleBlur}"
        @mousedown="${this.handleRippleMouseDown}"
        @mouseenter="${this.handleRippleMouseEnter}"
        @mouseleave="${this.handleRippleMouseLeave}"
        @touchstart="${this.handleRippleTouchStart}"
        @touchend="${this.handleRippleDeactivate}"
        @touchcancel="${this.handleRippleDeactivate}">
      ${this.renderRipple()}
    <i class="material-icons">${this.icon}</i>
    <span class="default-slot-container">
        <slot></slot>
    </span>
  </button>`;
    }
    handleRippleMouseDown(event) {
        const onUp = () => {
            window.removeEventListener('mouseup', onUp);
            this.handleRippleDeactivate();
        };
        window.addEventListener('mouseup', onUp);
        this.rippleHandlers.startPress(event);
    }
    handleRippleTouchStart(event) {
        this.rippleHandlers.startPress(event);
    }
    handleRippleDeactivate() {
        this.rippleHandlers.endPress();
    }
    handleRippleMouseEnter() {
        this.rippleHandlers.startHover();
    }
    handleRippleMouseLeave() {
        this.rippleHandlers.endHover();
    }
    handleRippleFocus() {
        this.rippleHandlers.startFocus();
    }
    handleRippleBlur() {
        this.rippleHandlers.endFocus();
    }
}
__decorate([
    property({ type: Boolean, reflect: true })
], IconButtonBase.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], IconButtonBase.prototype, "icon", void 0);
__decorate([
    property({ type: String })
], IconButtonBase.prototype, "label", void 0);
__decorate([
    query('button')
], IconButtonBase.prototype, "buttonElement", void 0);
__decorate([
    queryAsync('mwc-ripple')
], IconButtonBase.prototype, "ripple", void 0);
__decorate([
    internalProperty()
], IconButtonBase.prototype, "shouldRenderRipple", void 0);
__decorate([
    eventOptions({ passive: true })
], IconButtonBase.prototype, "handleRippleMouseDown", null);
__decorate([
    eventOptions({ passive: true })
], IconButtonBase.prototype, "handleRippleTouchStart", null);

/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const style = css `.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;font-size:24px;text-decoration:none;cursor:pointer;user-select:none;width:48px;height:48px;padding:12px}.mdc-icon-button svg,.mdc-icon-button img{width:24px;height:24px}.mdc-icon-button:disabled{color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38))}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}:host{display:inline-block;outline:none;--mdc-ripple-color: currentcolor}:host([disabled]){pointer-events:none}:host,.mdc-icon-button{vertical-align:top}.mdc-icon-button{width:var(--mdc-icon-button-size, 48px);height:var(--mdc-icon-button-size, 48px);padding:calc((var(--mdc-icon-button-size, 48px) - var(--mdc-icon-size, 24px)) / 2)}.mdc-icon-button>i{position:absolute;top:0;padding-top:inherit}.mdc-icon-button i,.mdc-icon-button svg,.mdc-icon-button img,.mdc-icon-button ::slotted(*){display:block;width:var(--mdc-icon-size, 24px);height:var(--mdc-icon-size, 24px)}`;

/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/** @soyCompatible */
let IconButton = class IconButton extends IconButtonBase {
};
IconButton.styles = style;
IconButton = __decorate([
    customElement('mwc-icon-button')
], IconButton);

class DHTGraph extends blackboardConnect('holochain-playground', LitElement) {
    constructor() {
        super(...arguments);
        this.lastNodes = [];
    }
    static get styles() {
        return [
            sharedStyles,
            css `
        :host {
          display: flex;
        }
      `,
        ];
    }
    async firstUpdated() {
        const nodes = dnaNodes(selectActiveCells(this.blackboard.state));
        this.cy = cytoscape_cjs({
            container: this.shadowRoot.getElementById('graph'),
            boxSelectionEnabled: false,
            elements: nodes,
            autoungrabify: true,
            userPanningEnabled: false,
            userZoomingEnabled: false,
            layout: { name: 'circle' },
            style: `
            node {
              background-color: gray;
              label: data(label);
              font-size: 20px;
              width: 50px;
              height: 50px;
            }

            
             .desktop{
                background-image: url("assets/desktop_windows-outline-white-36dp.svg");
              }
            
             .laptop{
                background-image: url("assets/laptop-outline-white-36dp.svg");
             }
            

            .selected {
              border-width: 4px;
              border-color: black;
              border-style: solid;
            }

            .smartphone{
              background-image: url("assets/smartphone-outline-white-36dp.svg");
            }
    
            .highlighted {
              background-color: yellow;
            }
    
            edge {
              width: 1;
              line-style: dotted;
            }
          `,
        });
        this.cy.on('tap', 'node', (evt) => {
            this.blackboard.update('activeAgentId', evt.target.id());
            this.blackboard.update('activeEntryId', null);
        });
    }
    highlightNodesWithEntry(entryId) {
        selectActiveCells(this.blackboard.state).forEach((cell) => this.cy.getElementById(cell.agentPubKey).removeClass('highlighted'));
        const cells = selectHoldingCells(this.blackboard.state)(entryId);
        for (const cell of cells) {
            this.cy.getElementById(cell.agentPubKey).addClass('highlighted');
        }
    }
    updated(changedValues) {
        super.updated(changedValues);
        if (this.shadowRoot.getElementById('graph')) {
            const newAgentIds = selectActiveCells(this.blackboard.state).map((c) => c.agentPubKey);
            if (!vectorsEqual(this.lastNodes, newAgentIds)) {
                if (this.layout)
                    this.layout.stop();
                this.cy.remove('nodes');
                const nodes = dnaNodes(selectActiveCells(this.blackboard.state));
                this.cy.add(nodes);
                this.layout = this.cy.elements().makeLayout({ name: 'circle' });
                this.layout.run();
                this.lastNodes = newAgentIds;
            }
            selectActiveCells(this.blackboard.state).forEach((cell) => this.cy.getElementById(cell.agentPubKey).removeClass('selected'));
            this.cy
                .getElementById(this.blackboard.state.activeAgentId)
                .addClass('selected');
            this.highlightNodesWithEntry(this.blackboard.state.activeEntryId);
        }
    }
    renderDHTHelp() {
        return html `
      <mwc-dialog id="dht-help" heading="DHT Help">
        <span>
          This is a visual interactive representation of a holochain
          <a
            href="https://developer.holochain.org/docs/concepts/4_public_data_on_the_dht/"
            target="_blank"
            >DHT</a
          >, with ${this.blackboard.state.conductors.length} nodes.
          <br />
          <br />
          In the DHT, all nodes have a <strong>public and private key</strong>.
          The public key is visible and shared througout the network, but
          private keys never leave their nodes. This public key is of 256 bits
          an it's actually the node's ID, which you can see labeled besides the
          nodes (encoded in base58 strings).
          <br />
          <br />
          If you pay attention, you will see that
          <strong>all nodes in the DHT are ordered alphabetically</strong>. This
          is because the nodes organize themselves in neighborhoods: they are
          more connected with the nodes that are closest to their ID, and less
          connected with the nodes that are far.
        </span>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
    }
    render() {
        return html `${this.renderDHTHelp()}
      <div class="column fill" style="position: relative">
        <h3 style="position: absolute; left: 28px; top: 28px;" class="title">
          DHT Nodes
        </h3>
        <div id="graph" style="height: 98%"></div>

        <mwc-icon-button
          style="position: absolute; right: 20px; top: 20px;"
          icon="help_outline"
          @click=${() => (this.dhtHelp.open = true)}
        ></mwc-icon-button>
      </div>`;
    }
}
__decorate([
    query('#dht-help'),
    __metadata("design:type", Dialog)
], DHTGraph.prototype, "dhtHelp", void 0);
customElements.define('holochain-playground-dht-graph', DHTGraph);

export { DHTGraph };
//# sourceMappingURL=holochain-playground-dht-graph.js.map
