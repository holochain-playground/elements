import '../_setToArray-0c1e9efa.js';
import '../core/cell/dht/get.js';
import '../tslib.es6-d17b0a4d.js';
import '../Subject-4f1cabc8.js';
import '../types/common.js';
import '../hash-9f18ad5a.js';
import '../types/entry.js';
import '../types/header.js';
import '../types/timestamp.js';
import '../core/cell/source-chain/utils.js';
import '../core/cell/source-chain/builder-headers.js';
import '../core/cell/source-chain/put.js';
import '../types/dht-op.js';
import '../core/cell/source-chain/get.js';
import '../core/cell/workflows/publish_dht_ops.js';
import '../core/cell/workflows/produce_dht_ops.js';
import '../core/cell/workflows/genesis.js';
import '../executor/immediate-executor.js';
import '../core/cell/workflows/call_zome_fn.js';
import '../types/cell-state.js';
import '../types/metadata.js';
import '../core/cell/dht/put.js';
import '../core/cell/workflows/integrate_dht_ops.js';
import '../core/cell/workflows/app_validation.js';
import '../core/cell/workflows/sys_validation.js';
import '../core/cell/workflows/incoming_dht_ops.js';
import '../core/cell.js';
import '../core/network/p2p-cell.js';
import '../core/network.js';
import '../core/conductor.js';
import '../core/cell/source-chain/actions.js';
import { sampleDna } from '../dnas/sample-dna.js';
import './message.js';
import { createConductors } from './create-conductors.js';

async function buildSimulatedPlayground(numConductors) {
    return createConductors(numConductors, [], sampleDna());
}

export { buildSimulatedPlayground };
//# sourceMappingURL=build-simulated-playground.js.map
