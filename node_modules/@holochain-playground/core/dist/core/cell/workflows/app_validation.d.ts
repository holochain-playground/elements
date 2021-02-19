import { Cell, Workflow } from '../../cell';
import { WorkflowReturn } from './workflows';
export declare const app_validation: (cell: Cell) => Promise<WorkflowReturn<void>>;
export declare type AppValidationWorkflow = Workflow<any, any>;
export declare function app_validation_task(cell: Cell): AppValidationWorkflow;
