import { Cell, Workflow } from '../../cell';
import { WorkflowReturn } from './workflows';
export declare const integrate_dht_ops: (cell: Cell) => Promise<WorkflowReturn<void>>;
export declare type IntegrateDhtOpsWorkflow = Workflow<void, void>;
export declare function integrate_dht_ops_task(cell: Cell): IntegrateDhtOpsWorkflow;
