import {
  AgentPubKey,
  CellId,
  Dictionary,
  getAgentPubKey,
  getDnaHash,
  Hash,
} from '../types/common';
import { DHTOp } from '../types/dht-op';
import { Conductor } from './conductor';
import { CellState } from '../types/cell-state';
import { genesis } from './cell/workflows/genesis';
import { Executor, Task } from '../executor/executor';
import { ImmediateExecutor } from '../executor/immediate-executor';
import { callZomeFn } from './cell/workflows/call_zome_fn';
import { SimulatedDna } from '../dnas/simulated-dna';
import { getCellId } from './cell/source-chain/utils';
import { P2pCell } from './network/p2p-cell';
import { incoming_dht_ops } from './cell/workflows/incoming_dht_ops';
import { Observable, Subject } from 'rxjs';

export type CellSignal = 'after-workflow-executed' | 'before-workflow-executed';
export type CellSignalListener = (payload: any) => void;

export class Cell {
  executor: Executor = new ImmediateExecutor();
  #pendingWorkflows: Array<Task<any>> = [];

  #signals = {
    'after-workflow-executed': new Subject<Task<any>>(),
    'before-workflow-executed': new Subject<Task<any>>(),
  };

  constructor(
    public state: CellState,
    public p2p: P2pCell,
    public simulatedDna?: SimulatedDna | undefined
  ) {}

  get cellId(): CellId {
    return getCellId(this.state);
  }

  get agentPubKey(): AgentPubKey {
    return getAgentPubKey(this.cellId);
  }

  get dnaHash(): Hash {
    return getDnaHash(this.cellId);
  }

  get signals() {
    return this.#signals;
  }

  static async create(
    conductor: Conductor,
    simulatedDna: SimulatedDna,
    agentId: AgentPubKey,
    membrane_proof: any
  ): Promise<Cell> {
    const newCellState: CellState = {
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

  getState(): CellState {
    return this.state;
  }

  triggerWorkflow(workflow: Task<any>) {
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

  callZomeFn(args: {
    zome: string;
    fnName: string;
    payload: any;
    cap: string;
  }): Promise<any> {
    return this.executor.execute({
      name: 'Call Zome Function Workflow',
      description: `Zome: ${args.zome}, Function name: ${args.fnName}`,
      task: () =>
        callZomeFn(args.zome, args.fnName, args.payload, args.cap)(this),
    });
  }

  /** Network handlers */
  // https://github.com/holochain/holochain/blob/develop/crates/holochain/src/conductor/cell.rs#L429
  public handle_publish(
    from_agent: AgentPubKey,
    dht_hash: Hash, // The basis for the DHTOps
    ops: Dictionary<DHTOp>
  ): Promise<void> {
    return incoming_dht_ops(dht_hash, ops, from_agent)(this);
  }
}
