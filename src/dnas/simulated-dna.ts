import { HdkAction } from '../core/cell/source-chain/actions';
import { Hash } from '../types/common';

export type SimulatedZome = {
  [fnName: string]: (payload: any) => Array<HdkAction>;
};

export type SimulatedDna = {
  hash: Hash;
  zomes: { [zome: string]: SimulatedZome };
};
