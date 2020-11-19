import { Constructor, LitElement } from 'lit-element';
import { Blackboard } from './blackboard';
import { CustomElement } from './custom-element';
export interface BlackboardContainerElement<S> extends CustomElement {
    blackboard: Blackboard<S>;
}
export declare const blackboardContainer: <S, T extends Constructor<LitElement> = Constructor<LitElement>>(blackboardId: string, baseElement: T) => Constructor<LitElement & BlackboardContainerElement<S>>;
