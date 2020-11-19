import '@material/mwc-circular-progress';
import { LitElement, PropertyValues } from 'lit-element';
import { Playground } from '../state/playground';
import { Blackboard } from '../blackboard/blackboard';
declare const PlaygroundContainer_base: import("lit-element").Constructor<LitElement & import("../blackboard/blackboard-container").BlackboardContainerElement<Playground>>;
export declare class PlaygroundContainer extends PlaygroundContainer_base {
    private initialConductors;
    numberOfSimulatedConductors: number;
    conductorsUrls: string[] | undefined;
    private snackbar;
    private message;
    static get styles(): import("lit-element").CSSResult;
    buildBlackboard(): Blackboard<Playground>;
    firstUpdated(): Promise<void>;
    updated(changedValues: PropertyValues): void;
    showError(error: string): void;
    renderSnackbar(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
}
export {};
