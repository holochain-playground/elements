import { AgentPubKey, Hash, CellId } from '@holochain-open-dev/core-types';
import { Cell, Workflow } from '../../cell';
import { WorkflowReturn } from './workflows';
export declare const genesis: (agentId: AgentPubKey, dnaHash: Hash, membrane_proof: any) => (cell: Cell) => Promise<WorkflowReturn<void>>;
export declare type GenesisWorkflow = Workflow<{
    cellId: CellId;
    membrane_proof: any;
}, void>;
export declare function genesis_task(cell: Cell, cellId: CellId, membrane_proof: any): GenesisWorkflow;
