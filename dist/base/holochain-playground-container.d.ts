import { Snackbar } from 'scoped-material-components/mwc-snackbar';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { LitElement, PropertyValues } from 'lit';
import { Conductor, SimulatedDna, SimulatedHappBundle } from '@holochain-playground/core';
import { AgentPubKeyB64, Dictionary, DnaHashB64 } from '@holochain-open-dev/core-types';
import { LightHappBundle } from './context';
declare const HolochainPlaygroundContainer_base: new () => LitElement;
export declare class HolochainPlaygroundContainer extends HolochainPlaygroundContainer_base {
    numberOfSimulatedConductors: number;
    simulatedHapp: SimulatedHappBundle;
    private snackbar;
    private message;
    /** Context variables */
    activeDna: DnaHashB64 | undefined;
    activeAgentPubKey: AgentPubKeyB64 | undefined;
    activeHash: DnaHashB64 | undefined;
    conductors: Conductor[];
    happs: Dictionary<LightHappBundle>;
    dnas: Dictionary<SimulatedDna>;
    conductorsUrls: string[] | undefined;
    static get provide(): string[];
    static get styles(): import("lit").CSSResultGroup;
    update(changedValues: PropertyValues): void;
    firstUpdated(): Promise<void>;
    showMessage(message: string): void;
    renderSnackbar(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    static elementDefinitions: {
        'mwc-circular-progress': typeof CircularProgress;
        'mwc-snackbar': typeof Snackbar;
        'mwc-icon-button': typeof IconButton;
    };
}
export {};
