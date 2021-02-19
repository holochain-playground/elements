import { Cell, Workflow } from '../../cell';
import { WorkflowReturn } from './workflows';
export declare const publish_dht_ops: (cell: Cell) => Promise<WorkflowReturn<void>>;
export declare type PublishDhtOpsWorkflow = Workflow<void, void>;
export declare function publish_dht_ops_task(cell: Cell): PublishDhtOpsWorkflow;
