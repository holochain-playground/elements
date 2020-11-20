import { Constructor, LitElement } from 'lit-element';
import { Blackboard } from './blackboard';
export interface PinnedElement<S> {
    blackboard: Blackboard<S>;
    stateUpdated(state: S): void;
}
export declare const blackboardConnect: <S, T extends Constructor<LitElement> = Constructor<LitElement>>(blackboardId: string, baseElement: T) => {
    new (...args: any[]): PinnedElement<S> & LitElement & T;
    prototype: any;
};
