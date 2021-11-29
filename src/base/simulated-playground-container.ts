import {
  IconButton,
  Snackbar,
  CircularProgress,
} from '@scoped-elements/material-web';
import { ProviderMixin } from 'lit-element-context';

import { LitElement, html, css, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import {
  Conductor,
  createConductors,
  demoHapp,
  hash,
  HashType,
  SimulatedDna,
  SimulatedHappBundle,
} from '@holochain-playground/core';
import {
  AgentPubKeyB64,
  Dictionary,
  DnaHashB64,
} from '@holochain-open-dev/core-types';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { ContextProvider } from '@lit-labs/context';

import {
  selectAllCells,
  selectCell,
  selectCells,
  selectHoldingCells,
} from './selectors';
import { LightDnaSlot, LightHappBundle } from './context';
import { PlaygroundContainer } from './playground-container';
import { SimulatedPlaygroundStore } from '../store/simulated-playground-store';
import { PlaygroundMode } from '../store/mode';

export class SimulatedPlaygroundContainer extends PlaygroundContainer<PlaygroundMode.Simulated> {
  @property({ type: Number })
  numberOfSimulatedConductors: number = 10;

  @property({ type: Object })
  simulatedHapp: SimulatedHappBundle = demoHapp();

  /** Context variables */

  async buildStore() {
    return SimulatedPlaygroundStore.create(
      this.numberOfSimulatedConductors,
      this.simulatedHapp
    );
  }
}
