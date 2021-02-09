import { Cell, Workflow } from '../../cell';
export declare const app_validation: (cell: Cell) => Promise<void>;
export declare type AppValidationWorkflow = Workflow<any, any>;
export declare function app_validation_task(cell: Cell): AppValidationWorkflow;
