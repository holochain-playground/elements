import { Cell, Workflow } from '../../cell';
export declare const publish_dht_ops: (cell: Cell) => Promise<void>;
export declare type PublishDhtOpsWorkflow = Workflow<void, void>;
export declare function publish_dht_ops_task(cell: Cell): PublishDhtOpsWorkflow;
