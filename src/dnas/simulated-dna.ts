import { HdkAction } from '../core/cell/source-chain/actions';

export type SimulatedZome = {
  [fnName: string]: (payload: any) => Array<HdkAction>;
};

export type SimulatedDna = {
  [zome: string]: SimulatedZome;
};
