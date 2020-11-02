import { AgentPubKey, Dictionary, Hash } from '../types/common';
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

export type CellId = [AgentPubKey, Hash];

export class Cell {
  #pendingWorkflows: Array<Task<any>> = [];
  executor: Executor = new ImmediateExecutor();

  private constructor(
    public conductor: Conductor,
    public state: CellState,
    public p2p: P2pCell,
    public simulatedDna?: SimulatedDna | undefined
  ) {}

  get cellId(): CellId {
    return getCellId(this.state);
  }

  static async create(
    conductor: Conductor,
    simulatedDna: SimulatedDna,
    agentId: AgentPubKey,
    dnaHash: Hash,
    membrane_proof: any
  ): Promise<Cell> {
    const newCellState: CellState = {
      CAS: {},
      CASMeta: {},
      integratedDHTOps: {},
      authoredDHTOps: {},
      sourceChain: [],
    };

    const p2p = conductor.createP2pCell([agentId, dnaHash]);

    const cell = new Cell(conductor, newCellState, p2p, simulatedDna);

    await cell.executor.execute({
      name: 'Genesis Workflow',
      description: 'Initialize the cell with all the needed databases',
      task: () => genesis(agentId, dnaHash, membrane_proof)(cell.state),
    });

    return cell;
  }

  triggerWorkflow(workflow: Task<any>) {
    this.#pendingWorkflows.push(workflow);

    setTimeout(() => this._runPendingWorkflows());
  }

  async _runPendingWorkflows() {
    const promises = this.#pendingWorkflows.map((w) =>
      this.executor.execute(w)
    );

    await Promise.all(promises);

    this.#pendingWorkflows = [];
  }

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
  ): Promise<void> {}
}
