const blackboardContainer = (blackboardId, baseElement) => {
    class BlackboardContainer extends baseElement {
        get state() {
            return this.blackboard.state;
        }
        connectedCallback() {
            super.connectedCallback();
            this.blackboard = this.buildBlackboard();
            this.addEventListener('connect-to-blackboard', (e) => {
                if (e.detail.blackboardId == blackboardId) {
                    e.stopPropagation();
                    e['blackboard'] = this.blackboard;
                }
            });
        }
    }
    return BlackboardContainer;
};

export { blackboardContainer };
//# sourceMappingURL=blackboard-container.js.map
