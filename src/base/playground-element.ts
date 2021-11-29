import { playgroundContext } from './context';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement } from 'lit';
import { contextProvided } from '@lit-labs/context';
import { PlaygroundStore } from '../store/base';
import { PlaygroundMode } from '../store/mode';

export class PlaygroundElement<
  T extends PlaygroundMode
> extends ScopedElementsMixin(LitElement) {
  @contextProvided({ context: playgroundContext })
  store: PlaygroundStore<T>;

  showMessage(message: string) {
    this.dispatchEvent(
      new CustomEvent('show-message', {
        bubbles: true,
        composed: true,
        detail: { message },
      })
    );
  }
}
