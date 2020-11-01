import { AgentPubKey, Dictionary, Hash } from '../types/common';
import {
  DHTOp,
  entryToDHTOps,
  neighborhood,
  DHTOpType,
  hashDHTOp,
  sortDHTOps,
} from '../types/dht-op';
import { Entry, EntryType, hashEntry } from '../types/entry';
import { hash, distance, compareBigInts } from '../processors/hash';
import { Header } from '../types/header';
import { NetworkMessageType, NetworkMessage, Network } from './network';
import { Conductor } from './conductor';
import { CellState } from '../types/cell-state';
import { genesis } from './workflows/genesis';
import { Executor, Task } from '../executor/executor';
import { ImmediateExecutor } from '../executor/immediate-executor';
import { callZomeFn } from './workflows/call_zome_fn';
import { SimulatedDna } from '../dnas/simulated-dna';

export type CellId = [AgentPubKey, Hash];

export class Cell {
  #pendingWorkflows: Array<Task<any>> = [];
  executor: Executor = new ImmediateExecutor();

  private constructor(
    public conductor: Conductor,
    public state: CellState,
    public simulatedDna?: SimulatedDna | undefined
  ) {}

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

    const cell = new Cell(conductor, newCellState, simulatedDna);

    await cell.executor.execute({
      name: 'Genesis Workflow',
      description: 'Initialize the cell with all the needed databases',
      task: () => genesis(agentId, dnaHash, membrane_proof)(cell.state),
    });

    return cell;
  }

  triggerWorkflow(workflow: Task<any>) {
    this.#pendingWorkflows.push(workflow);
  }

  _runWorkflows() {
    for (const workflow of this.#pendingWorkflows) {
      this.executor.execute(workflow);
    }

    this.#pendingWorkflows = [];
  }

  callZomeFn(args: {
    zome: string;
    fnName: string;
    payload: any;
    cap: string;
  }): Promise<T> {
    return this.executor.execute({
      name: 'Call Zome Function Workflow',
      description: `Zome: ${args.zome}, Function name: ${args.fnName}`,
      task: () =>
        callZomeFn(args.zome, args.fnName, args.payload, args.cap)(this),
    });
  }

  async publishEntry(entry: Entry, header: Header) {
    const dhtOps = await entryToDHTOps(entry, header);

    this.fastPush(dhtOps);
  }

  republish() {
    for (const headerId of this.sourceChain) {
      const header: Header = this.CAS[headerId];
      const entry: Entry = this.CAS[header.entry_address];
      this.publishEntry(entry, header);
    }
  }

  async fastPush(dhtOps: DHTOp[]): Promise<void> {
    for (const dhtOp of dhtOps) {
      const hood = await neighborhood(dhtOp);
      const dhtOpId = await hashDHTOp(dhtOp);
      const message: NetworkMessage = {
        type: NetworkMessageType.Publish,
        payload: {
          dhtOp,
          dhtOpId,
        },
      };

      const peers = this.getNPeersClosestTo(this.redundancyFactor, hood);

      for (const peer of peers) {
        this.conductor.sendMessage(this.dna, this.agentId, peer, message);
      }
    }
  }

  getEntry(hash: string): Entry | undefined {
    const peer = this.getNPeersClosestTo(1, hash);

    const message: NetworkMessage = {
      type: NetworkMessageType.GetEntry,
      payload: hash,
    };

    return this.conductor.sendMessage(this.dna, this.agentId, peer[0], message);
  }

  getDHTShard(): Dictionary<EntryMetadata> {
    const dhtShard = {};

    for (const hash of Object.keys(this.CASMeta)) {
      const entryMetadata = this.getEntryMetadata(hash);
      dhtShard[hash] = {
        entry: this.CAS[hash],
        metadata: entryMetadata,
      };
    }

    return dhtShard;
  }

  getEntryMetadata(hash: string): EntryMetadata | undefined {
    const processHeaders = (headerAddresses: string[]) =>
      headerAddresses.reduce(
        (acc, next) => ({ ...acc, [next]: this.CAS[next] as Header }),
        {} as Dictionary<Header>
      );

    if (!this.CASMeta[hash]) return undefined;
    const metadata: CASMetadata = { ...this.CASMeta[hash] };

    if (metadata[AGENT_HEADERS]) {
      ((metadata as unknown) as EntryMetadata)[AGENT_HEADERS] = processHeaders(
        metadata[AGENT_HEADERS]
      );
    }

    if (metadata[HEADERS]) {
      ((metadata as unknown) as EntryMetadata)[HEADERS] = processHeaders(
        metadata[HEADERS]
      );
    }

    return (metadata as unknown) as EntryMetadata;
  }

  getNeighbors(): string[] {
    const sortedPeers = this.peers.sort((agentA: string, agentB: string) => {
      const distanceA = distance(this.agentId, agentA);
      const ditsanceB = distance(this.agentId, agentB);
      return compareBigInts(distanceA, ditsanceB);
    });

    const neighbors = sortedPeers.slice(0, 4);

    if (sortedPeers.length > 4) {
      const half = Math.floor(this.peers.length / 2);
      neighbors.push(sortedPeers[half]);
    }
    if (sortedPeers.length > 8) {
      const prehalf = Math.floor(this.peers.length * 0.35);
      neighbors.push(sortedPeers[prehalf]);
      const posthalf = Math.floor(this.peers.length * 0.65);
      neighbors.push(sortedPeers[posthalf]);
    }

    return neighbors;
  }

  getNPeersClosestTo(n: number, hash: string): string[] {
    const sortedPeers = [this.agentId, ...this.peers].sort(
      (agentA: string, agentB: string) => {
        const distanceA = distance(hash, agentA);
        const distanceB = distance(hash, agentB);
        return compareBigInts(distanceA, distanceB);
      }
    );

    return sortedPeers.slice(0, n);
  }

  newHeader(entryId: string, replacedEntryAddress: string | undefined): Header {
    const lastHeaderAddress =
      this.sourceChain.length > 0
        ? this.sourceChain[this.sourceChain.length - 1]
        : undefined;

    return {
      agent_id: this.agentId,
      entry_address: entryId,
      replaced_entry_address: replacedEntryAddress,
      timestamp: Math.floor(Date.now() / 1000),
      last_header_address: lastHeaderAddress,
    };
  }

  async createHeader(
    entryId: string,
    replacedEntryAddress: string | undefined
  ): Promise<Header> {
    const header = this.newHeader(entryId, replacedEntryAddress);
    const headerId = await hash(header);

    this.CAS[headerId] = header;
    this.sourceChain.push(headerId);

    return header;
  }

  initDHTShardForEntry(entryHash: string) {
    if (!this.CASMeta[entryHash]) {
      this.CASMeta[entryHash] = {
        HEADERS: [],
        LINKS_TO: [],
        CRUDStatus: undefined,
        REPLACED_BY: undefined,
        REPLACES: undefined,
        DELETED_BY: undefined,
      };
    }
  }

  updateDHTShard() {
    this.CASMeta = {};

    const dhtOps = Object.values(this.DHTOpTransforms);

    for (const dhtOp of sortDHTOps(dhtOps)) {
      const header = dhtOp.header;
      const headerHash = dhtOp.headerId;
      this.CAS[headerHash] = header;
      const entryHash = dhtOp.header.entry_address;

      switch (dhtOp.type) {
        case DHTOpType.RegisterAgentActivity:
          this.initDHTShardForEntry(dhtOp.header.agent_id);

          if (!this.CASMeta[dhtOp.header.agent_id][AGENT_HEADERS]) {
            this.CASMeta[dhtOp.header.agent_id][AGENT_HEADERS] = [];
          }

          this.CASMeta[dhtOp.header.agent_id][AGENT_HEADERS].push(headerHash);
          break;
        case DHTOpType.StoreEntry:
          this.CAS[entryHash] = dhtOp.entry;

          this.initDHTShardForEntry(entryHash);

          this.CASMeta[entryHash][CRUDStatus] = 'Live';

          if (dhtOp.header.replaced_entry_address) {
            this.CASMeta[entryHash][REPLACES] =
              dhtOp.header.replaced_entry_address;
          }

          if (!this.CASMeta[entryHash][HEADERS]) {
            this.CASMeta[entryHash][HEADERS] = [];
          }
          this.CASMeta[entryHash][HEADERS].push(headerHash);
          break;
        case DHTOpType.RegisterUpdatedTo:
          this.initDHTShardForEntry(header.replaced_entry_address);

          if (
            !this.CASMeta[header.replaced_entry_address][CRUDStatus] ||
            this.CASMeta[header.replaced_entry_address][CRUDStatus] !== 'Dead'
          ) {
            this.CASMeta[header.replaced_entry_address][CRUDStatus] = 'Dead';
            this.CASMeta[header.replaced_entry_address][REPLACED_BY] = [
              entryHash,
            ];
          } else {
            let replacedBy = this.CASMeta[header.replaced_entry_address][
              REPLACED_BY
            ];
            this.CASMeta[header.replaced_entry_address][CRUDStatus] =
              'CONFLICT';
            replacedBy.push(entryHash);
            this.CASMeta[header.replaced_entry_address][
              REPLACED_BY
            ] = replacedBy;
          }

          break;
        case DHTOpType.RegisterDeletedBy:
          const deletedEntryHash = dhtOp.entry.payload.deletedEntry;

          this.initDHTShardForEntry(deletedEntryHash);

          this.CASMeta[deletedEntryHash][CRUDStatus] = 'Dead';
          this.CASMeta[deletedEntryHash][REPLACED_BY] = undefined;
          this.CASMeta[deletedEntryHash][DELETED_BY] = header.entry_address;

          break;
        case DHTOpType.RegisterAddLink:
          this.initDHTShardForEntry(dhtOp.entry.payload.base);

          this.CASMeta[dhtOp.entry.payload.base][LINKS_TO].push({
            target: dhtOp.entry.payload.target,
            tag: dhtOp.entry.payload.tag,
            type: dhtOp.entry.payload.type,
            timestamp: dhtOp.header.timestamp,
          });
          break;
        case DHTOpType.RegisterRemoveLink:
          this.initDHTShardForEntry(dhtOp.entry.payload.base);

          const linkIndex = (this.CASMeta[dhtOp.entry.payload.base][
            LINKS_TO
          ] as Array<any>).findIndex(
            (link) =>
              link.type === dhtOp.entry.payload.type &&
              link.target === dhtOp.entry.payload.target &&
              link.timestamp === dhtOp.entry.payload.timestamp
          );
          (this.CASMeta[dhtOp.entry.payload.base][LINKS_TO] as Array<
            any
          >).splice(linkIndex, 1);
          break;
      }
    }
  }

  /** Network */

  handleNetworkMessage(fromAgentId: string, message: NetworkMessage): any {
    switch (message.type) {
      case NetworkMessageType.Publish:
        return this.handlePublishRequest(
          message.payload.dhtOpId,
          message.payload.dhtOp
        );
      case NetworkMessageType.GetEntry:
        return this.CAS[message.payload];
    }
  }

  joinNetwork() {}

  handlePublishRequest(hash: string, dhtOp: DHTOp) {
    if (this.DHTOpTransforms[hash]) return;

    this.DHTOpTransforms[hash] = dhtOp;

    this.updateDHTShard();
  }
}
