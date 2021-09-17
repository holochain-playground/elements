import { html } from 'lit';
import { GetContent } from './get-content';
import { ItemElement } from './item-element';

export class CollectionElement extends ItemElement {
  async getCollectionContent() {
    const children = await this.getSlottedChildren();

    const promises = children
      .filter(node => (node as unknown as GetContent).getContent)
      .map(node => (node as unknown as GetContent).getContent());
    const content = await Promise.all(promises);

    return content;
  }

  render() {
    return html`<slot id="slot" style="display: none"></slot>`;
  }
}
