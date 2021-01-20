import { LitElement } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { PlaygroundMixin } from '@holochain-playground/container';

export class BaseElement extends PlaygroundMixin(
  ScopedElementsMixin(LitElement)
) {}
