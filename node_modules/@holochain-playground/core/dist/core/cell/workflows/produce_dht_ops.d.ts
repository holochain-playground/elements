import { Cell, Workflow } from '../../cell';
import { WorkflowReturn } from './workflows';
export declare const produce_dht_ops: (cell: Cell) => Promise<WorkflowReturn<void>>;
export declare type ProduceDhtOpsWorkflow = Workflow<void, void>;
export declare function produce_dht_ops_task(cell: Cell): ProduceDhtOpsWorkflow;
