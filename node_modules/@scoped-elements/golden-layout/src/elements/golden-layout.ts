import { css, html } from 'lit';
import { Constructor } from '@open-wc/scoped-elements/types/src/types';

import {
  GoldenLayout as GoldenLayoutClass,
  LayoutConfig,
  ResolvedLayoutConfig,
} from 'golden-layout';
import { property } from 'lit/decorators.js';

import { ContextProvider } from '@lit-labs/context';

import { BaseElement } from '../utils/base-element';
import { goldenLayoutContext } from '../utils/context';
import { INIT_LAYOUT_EVENT, ROOT_LOADED_EVENT } from '../utils/events';

export class GoldenLayout extends BaseElement {
  @property()
  scopedElements: { [key: string]: Constructor<HTMLElement> } | undefined =
    undefined;

  @property()
  layoutConfig: LayoutConfig | undefined = undefined;

  _goldenLayoutContext = new ContextProvider(this, goldenLayoutContext);

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(INIT_LAYOUT_EVENT, e => {
      e.preventDefault();
      e.stopPropagation();
      const layout = new GoldenLayoutClass(
        (e as CustomEvent).detail.element as HTMLElement
      );
      if (this.layoutConfig) {
        layout.loadLayout(this.layoutConfig);
      }

      layout.registerComponentFactoryFunction(
        'native-html-component',
        (container, state) => {
          container.element.innerHTML = (state as any).html;
        }
      );
      this._goldenLayoutContext.setValue(layout as unknown as never);
    });
    this.addEventListener(ROOT_LOADED_EVENT, e => {
      e.preventDefault();
      e.stopPropagation();
      if (this.scopedElements) {
        for (const [tag, el] of Object.entries(this.scopedElements)) {
          (e as any).detail.rootElement.defineScopedElement(tag, el);
        }
      }

      if (!this.layoutConfig) {
        this._goldenLayoutContext.value.loadLayout({
          root: (e as any).detail.root,
          header: {
            popout: false,
          },
        });
      }
    });
  }

  saveLayout(): ResolvedLayoutConfig {
    return this._goldenLayoutContext.value.saveLayout();
  }

  render() {
    return html` <slot></slot> `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex: 1;
        }
      `,
    ];
  }
}
