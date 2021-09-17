import { property } from 'lit/decorators.js';
import { BaseElement } from './base-element';

export class ItemElement extends BaseElement {
  @property()
  height: number | undefined = undefined;

  @property()
  width: number | undefined = undefined;

  getCommonConfig() {
    return {
      height: this.height,
      width: this.width,
    };
  }
}
