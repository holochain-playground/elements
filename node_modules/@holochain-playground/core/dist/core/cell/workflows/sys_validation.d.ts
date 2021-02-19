import { Cell } from '../../cell';
import { Workflow, WorkflowReturn } from './workflows';
export declare const sys_validation: (cell: Cell) => Promise<WorkflowReturn<void>>;
export declare type SysValidationWorkflow = Workflow<void, void>;
export declare function sys_validation_task(cell: Cell): SysValidationWorkflow;
