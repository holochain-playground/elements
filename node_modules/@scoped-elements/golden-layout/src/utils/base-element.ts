import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement } from 'lit';

export class BaseElement extends ScopedElementsMixin(LitElement) {
  _slottedChildren: Array<HTMLElement> | undefined = undefined;

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector('slot');

    slot?.addEventListener('slotchange', () => {
      const childNodes = slot?.assignedNodes({ flatten: true });
      this._slottedChildren = Array.prototype.filter.call(
        childNodes,
        node => node.nodeType === Node.ELEMENT_NODE
      );
    });
  }

  async getSlottedChildren(): Promise<Array<HTMLElement>> {
    const slot = this.shadowRoot?.querySelector('slot');

    if (this._slottedChildren) return this._slottedChildren;

    return new Promise(resolve => {
      slot?.addEventListener('slotchange', () => {
        const childNodes = slot?.assignedNodes({ flatten: true });

        resolve(
          Array.prototype.filter.call(
            childNodes,
            node => node.nodeType === Node.ELEMENT_NODE
          )
        );
      });
    });
  }
}
