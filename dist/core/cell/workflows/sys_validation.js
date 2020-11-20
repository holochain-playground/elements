import 'lodash-es';
import '../../../hash-bca98662.js';
import 'byte-base64';
import '../../../types/entry.js';
import '../../../types/header.js';
import '../../../types/dht-op.js';
import { ValidationLimboStatus } from '../../../types/cell-state.js';
import '../../../types/metadata.js';
import { getValidationLimboDhtOps } from '../dht/get.js';
import '../dht/put.js';
import './integrate_dht_ops.js';
import { app_validation_task } from './app_validation.js';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/sys_validation_workflow.rs
const sys_validation = async (cell) => {
    const pendingDhtOps = getValidationLimboDhtOps(cell.state, ValidationLimboStatus.Pending);
    // TODO: actually validate
    for (const dhtOpHash of Object.keys(pendingDhtOps)) {
        const limboValue = pendingDhtOps[dhtOpHash];
        limboValue.status = ValidationLimboStatus.SysValidated;
    }
    cell.triggerWorkflow(app_validation_task(cell));
};
function sys_validation_task(cell) {
    return {
        name: 'System Validation of the DHT Op',
        description: 'Subconscious checks of data integrity',
        task: () => sys_validation(cell),
    };
}

export { sys_validation, sys_validation_task };
//# sourceMappingURL=sys_validation.js.map
