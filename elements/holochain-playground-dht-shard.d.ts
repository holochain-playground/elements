import { LitElement } from 'lit-element';
import { Playground } from '../state/playground';
import { Cell } from '../core/cell';
import '@alenaksu/json-viewer';
declare const DHTShard_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class DHTShard extends DHTShard_base {
    cell: {
        dna: string;
        agentId: string;
    };
    static style(): import("lit-element").CSSResult;
    getCell(): Cell;
    render(): import("lit-element").TemplateResult;
}
export {};
