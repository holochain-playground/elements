import { Observable, Subscription } from 'rxjs';
import { Dictionary } from '../types/common';
export interface PersistOptions<S> {
    persistId: string;
    serializer?: (state: S) => string;
    deserializer?: (stateString: string) => S;
}
export declare class Blackboard<S extends Dictionary<any>> {
    protected initialState: S;
    protected persistOptions?: PersistOptions<S>;
    private subject;
    protected _state: S;
    constructor(initialState: S, persistOptions?: PersistOptions<S>);
    get state(): S;
    subscribe(next: (value: S) => void, error?: (error: any) => void, complete?: () => void): Subscription;
    select(selector: string | ((state: S) => any)): Observable<any>;
    update(key: keyof S, value: any): void;
    updateState(state: S): void;
    reset(): void;
    private stateUpdated;
    private persistState;
    private hidrateState;
}
