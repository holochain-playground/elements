import { createContext } from 'lit-context';
import { Conductor } from '../../core/conductor';
import { Hash } from '../../types/common';

// This is very important since it registers our custom provider
// instead of the default one by lit-context
import '../holochain-playground-provider';

// Create a context
const { consume: consumePlayground } = createContext('holochain-playground', {
  activeDna: undefined,
  activeAgentPubKey: undefined,
  activeEntryHash: undefined,
  conductors: [],
  conductorsUrls: undefined,
});

export interface PlaygroundContext {
  activeDna: Hash;
  activeAgentPubKey: Hash | undefined;
  activeEntryHash: Hash | undefined;
  conductors: Conductor[];
  conductorsUrls: string[] | undefined;
}

export class UpdateContextEvent extends CustomEvent<
  Partial<PlaygroundContext>
> {
  constructor(context: Partial<PlaygroundContext>) {
    super('update-context', {
      bubbles: true,
      composed: true,
      detail: context,
    });
  }
}

export { consumePlayground };
