import { isEqual } from 'lodash-es';
import { Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

class Blackboard {
    constructor(initialState, persistOptions) {
        this.initialState = initialState;
        this.persistOptions = persistOptions;
        this._state = initialState;
        this.subject = new Subject();
        this.hidrateState();
        this.stateUpdated();
    }
    get state() {
        return this._state;
    }
    subscribe(next, error, complete) {
        return this.subject.subscribe(next, error, complete);
    }
    select(selector) {
        let lastValue = undefined;
        return this.subject.pipe(mergeMap((state) => {
            let value;
            if (typeof selector === 'string') {
                value = state[selector];
            }
            else {
                value = selector(state);
            }
            if (!isEqual(lastValue, value)) {
                lastValue = value;
                return [lastValue];
            }
            else
                return [];
        }));
    }
    update(key, value) {
        this._state[key] = value;
        this.stateUpdated();
    }
    updateState(state) {
        if (!isEqual(state, this._state)) {
            this._state = state;
            this.stateUpdated();
        }
    }
    reset() {
        this._state = this.initialState;
        this.stateUpdated();
    }
    stateUpdated() {
        this.persistState();
        this.subject.next(this._state);
    }
    persistState() {
        if (this.persistOptions !== undefined) {
            const stateString = this.persistOptions.serializer
                ? this.persistOptions.serializer(this._state)
                : JSON.stringify(this._state);
            localStorage.setItem(this.persistOptions.persistId, stateString);
        }
    }
    hidrateState() {
        if (this.persistOptions !== undefined) {
            const stateString = localStorage.getItem(this.persistOptions.persistId);
            if (stateString) {
                this._state = this.persistOptions.deserializer
                    ? this.persistOptions.deserializer(stateString)
                    : JSON.parse(stateString);
                setTimeout(() => this.subject.next(this._state));
            }
        }
    }
}

export { Blackboard };
//# sourceMappingURL=blackboard.js.map
