import {
  Dictionary,
  EntryVisibility,
  Hash,
} from '@holochain-open-dev/core-types';
import { ValidationOutcome } from '../core/cell/sys_validate/types';
import {
  SimulatedValidateFunctionContext,
  SimulatedZomeFunctionContext,
} from '../core/hdk';

export interface SimulatedZomeFunctionArgument {
  name: string;
  type: string;
}

export interface SimulatedZomeFunction {
  call: (
    context: SimulatedZomeFunctionContext
  ) => (payload: any) => Promise<any>;
  arguments: SimulatedZomeFunctionArgument[];
}

export type SimulatedValidateFunction = (
  context: SimulatedValidateFunctionContext
) => (payload: any) => Promise<ValidationOutcome>;

export interface SimulatedZome {
  name: string;
  entry_defs: Array<EntryDef>;
  zome_functions: Dictionary<SimulatedZomeFunction>;
  validation_functions: Dictionary<SimulatedValidateFunction>;
  blocklyCode?: string;
}

export type SimulatedDnaTemplate = {
  zomes: Array<SimulatedZome>;
};

export interface SimulatedDna {
  zomes: Array<SimulatedZome>;
  properties: any;
  uuid: string;
}

export interface EntryDef {
  id: string;
  visibility: EntryVisibility;
}
