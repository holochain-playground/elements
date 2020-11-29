import { getAgentPubKey, getDnaHash } from '../types/common.js';
import '../processors/hash.js';
import 'byte-base64';
import '../types/entry.js';
import '../types/header.js';
import '../types/timestamp.js';
import { getCellId } from './cell/source-chain/utils.js';
import './cell/source-chain/builder-headers.js';
import './cell/source-chain/put.js';
import '../types/dht-op.js';
import './cell/source-chain/get.js';
import './cell/workflows/publish_dht_ops.js';
import './cell/workflows/produce_dht_ops.js';
import { genesis } from './cell/workflows/genesis.js';
import { ImmediateExecutor } from '../executor/immediate-executor.js';
import { callZomeFn } from './cell/workflows/call_zome_fn.js';
import '../types/cell-state.js';
import '../types/metadata.js';
import 'lodash-es';
import './cell/dht/get.js';
import './cell/dht/put.js';
import './cell/workflows/integrate_dht_ops.js';
import './cell/workflows/app_validation.js';
import './cell/workflows/sys_validation.js';
import { incoming_dht_ops } from './cell/workflows/incoming_dht_ops.js';
import { Subject } from 'rxjs';

class Cell {
    constructor(state, p2p, simulatedDna) {
        this.state = state;
        this.p2p = p2p;
        this.simulatedDna = simulatedDna;
        this.executor = new ImmediateExecutor();
        this.#pendingWorkflows = [];
        this.#signals = {
            'after-workflow-executed': new Subject(),
            'before-workflow-executed': new Subject(),
        };
    }
    #pendingWorkflows;
    #signals;
    get cellId() {
        return getCellId(this.state);
    }
    get agentPubKey() {
        return getAgentPubKey(this.cellId);
    }
    get dnaHash() {
        return getDnaHash(this.cellId);
    }
    get signals() {
        return this.#signals;
    }
    static async create(conductor, simulatedDna, agentId, membrane_proof) {
        const newCellState = {
            CAS: {},
            integrationLimbo: {},
            metadata: {
                link_meta: [],
                misc_meta: {},
                system_meta: {},
            },
            validationLimbo: {},
            integratedDHTOps: {},
            authoredDHTOps: {},
            sourceChain: [],
        };
        const p2p = conductor.network.createP2pCell([agentId, simulatedDna.hash]);
        const cell = new Cell(newCellState, p2p, simulatedDna);
        await cell.executor.execute({
            name: 'Genesis Workflow',
            description: 'Initialize the cell with all the needed databases',
            task: () => genesis(agentId, simulatedDna.hash, membrane_proof)(cell),
        });
        return cell;
    }
    getState() {
        return this.state;
    }
    triggerWorkflow(workflow) {
        this.#pendingWorkflows.push(workflow);
        setTimeout(() => this._runPendingWorkflows());
    }
    async _runPendingWorkflows() {
        const workflowsToRun = this.#pendingWorkflows;
        this.#pendingWorkflows = [];
        const promises = workflowsToRun.map((w) => {
            this.#signals['before-workflow-executed'].next(w);
            this.executor
                .execute(w)
                .then(() => this.#signals['after-workflow-executed'].next(w));
        });
        await Promise.all(promises);
    }
    /** Workflows */
    callZomeFn(args) {
        return this.executor.execute({
            name: 'Call Zome Function Workflow',
            description: `Zome: ${args.zome}, Function name: ${args.fnName}`,
            task: () => callZomeFn(args.zome, args.fnName, args.payload, args.cap)(this),
        });
    }
    /** Network handlers */
    // https://github.com/holochain/holochain/blob/develop/crates/holochain/src/conductor/cell.rs#L429
    handle_publish(from_agent, dht_hash, // The basis for the DHTOps
    ops) {
        return incoming_dht_ops(dht_hash, ops, from_agent)(this);
    }
}

export { Cell };
//# sourceMappingURL=cell.js.map
