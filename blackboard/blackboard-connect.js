const blackboardConnect = (blackboardId, baseElement) => class extends baseElement {
    connectedCallback() {
        super.connectedCallback();
        const e = new CustomEvent('connect-to-blackboard', {
            bubbles: true,
            composed: true,
            detail: {
                blackboardId,
            },
        });
        this.dispatchEvent(e);
        this.blackboard = e['blackboard'];
        if (!this.blackboard) {
            throw new Error('Could not connect to the blackboard: this element must be contained inside a blackboard-container element with the same blackboardId');
        }
        this.blackboard.subscribe((state) => {
            if (this.requestUpdate) {
                this.requestUpdate();
            }
            this.stateUpdated(state);
        });
    }
    stateUpdated(state) { }
};

export { blackboardConnect };
//# sourceMappingURL=blackboard-connect.js.map
