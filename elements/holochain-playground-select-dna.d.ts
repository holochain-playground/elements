import { Playground } from '../state/playground';
import { LitElement } from 'lit-element';
declare const SelectDNA_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class SelectDNA extends SelectDNA_base {
    selectDNA(dna: string): void;
    render(): import("lit-element").TemplateResult;
}
export {};
